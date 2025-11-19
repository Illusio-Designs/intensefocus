import jwt from 'jsonwebtoken';
import { User } from '../../generated/prisma/browser';
import prisma from "../constants/prisma";
import { role_descriptions, role_hierarchy, role_permissions } from '../constants/roles';
import msg91Service from "./msg91.service";

class AuthService {
    /**
     * Get MSG91 widget configuration
     */
    getMSG91Config(phoneNumber: string) {
        return msg91Service.getWidgetConfig(phoneNumber);
    }

    /**
     * Login with MSG91 OTP token
     */
    async loginWithMSG91Token(phoneNumber: string, accessToken: string) {
        try {
            // Verify the MSG91 access token
            await msg91Service.verifyAccessToken(accessToken);

            // Find user by phone number
            const user = await prisma.user.findUnique({
                where: {
                    mobile: phoneNumber,
                    flag: 1
                },
                include: {
                    role: true
                }
            });

            if (!user) {
                throw new Error('No account found with this phone number');
            }

            return this.generateAuthResponse(user);
        } catch (error: any) {
            throw new Error('OTP verification failed: ' + error.message);
        }
    }

    /**
     * Register user (Direct - No OTP verification)
     */
    async registerUser(phoneNumber: string, name: string, role_id = 3) {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: {
                    mobile: phoneNumber
                }
            });

            if (existingUser) {
                throw new Error('User already exists with this phone number');
            }
            const role = await prisma.roleType.findUnique({
                where: {
                    id: role_id
                }
            });

            if (!role) {
                throw new Error('Role not found');
            }
            // Create new user with mobile number
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    mobile: phoneNumber,
                    role_id: role.id,
                    flag: 1, // Active user
                    role_type: role.type
                }
            });

            // Fetch user with role information
            const user = await prisma.user.findUnique({
                where: {
                    id: newUser.id
                },
                include: {
                    role: true
                }
            });

            if (!user) {
                throw new Error('User not found');
            }

            return this.generateAuthResponse(user);
        } catch (error: any) {
            throw new Error('Registration failed: ' + error.message);
        }
    }

    /**
     * Generate authentication response with detailed role information
     */
    generateAuthResponse(user: User) {
        const token = jwt.sign(
            {
                id: user.id,
                role_id: user.role_id,
                flag: user.flag
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                phone: user.mobile,
                profile_image: user.profile_image,
                role_id: user.role_id,
                flag: user.flag,
                account_status: {
                    active: user.flag === 1,
                    flag: user.flag
                },
                last_login: user.last_login || null
            },
            token,
            login_info: {
                login_time: new Date().toISOString(),
                token_expires_in: '24h',
                role_hierarchy: this.getRoleHierarchy(user.flag || 1),
                permissions: this.getRolePermissions(user.role_type)
            }
        };
    }

    /**
     * Get role hierarchy based on permission level
     */
    getRoleHierarchy(permissionLevel: number) {
        return role_hierarchy[permissionLevel] || 'Unknown Level';
    }

    /**
     * Get role description
     */
    getRoleDescription(roleName: string) {
        return role_descriptions[roleName] || 'Unknown role';
    }

    /**
     * Get role-specific permissions
     */
    getRolePermissions(roleName: string) {
        return role_permissions[roleName] || ['basic_access'];
    }
}
const authService = new AuthService();
export default authService;