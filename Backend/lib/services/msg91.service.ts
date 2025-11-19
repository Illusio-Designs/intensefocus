import axios from "axios";

class MSG91Service {
    widgetId: string | undefined;
    authKey: string | undefined;
    baseUrl: string = 'https://control.msg91.com/api/v5';

    initialize() {
        this.widgetId = process.env.MSG91_WIDGET_ID;
        this.authKey = process.env.MSG91_AUTH_KEY;
        this.baseUrl = 'https://control.msg91.com/api/v5';

        // Validate environment variables
        if (!this.widgetId || !this.authKey) {
            console.warn('⚠️  MSG91 credentials not configured. Set MSG91_WIDGET_ID and MSG91_AUTH_KEY in .env file');
        }
    }
    /**
     * Verify MSG91 access token (Server-side verification)
     * This is called after client-side OTP verification
     * @param {string} accessToken - JWT token from OTP widget
     * @returns {Promise<Object>} Verification response
     */
    async verifyAccessToken(accessToken: string) {
        try {
            if (!accessToken) {
                throw new Error('Access token is required');
            }

            if (!this.authKey) {
                throw new Error('MSG91_AUTH_KEY not configured');
            }

            console.log('🔍 Verifying MSG91 Access Token...');
            console.log('Token Type:', typeof accessToken);
            console.log('Token Length:', accessToken?.length);
            console.log('Token Preview:', accessToken?.substring?.(0, 50) + '...');

            const requestData = {
                authkey: this.authKey,
                "access-token": accessToken
            };

            console.log('Request Data:', {
                authkey: this.authKey.substring(0, 10) + '...',
                'access-token': typeof accessToken === 'string' ? accessToken.substring(0, 50) + '...' : accessToken
            });

            const response = await axios.post(
                `${this.baseUrl}/widget/verifyAccessToken`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 10000 // 10 seconds timeout
                }
            );

            console.log('✅ MSG91 Verification Response:', response.data);

            // Check if verification was successful
            if (response.data && response.data.type === 'success') {
                return {
                    success: true,
                    message: 'OTP verified successfully',
                    data: response.data
                };
            }

            throw new Error('OTP verification failed');

        } catch (error: any) {
            // Log detailed error for debugging
            console.error('❌ MSG91 Token Verification Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                code: error.code,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });

            // Throw user-friendly error
            if (error.response?.status === 401) {
                throw new Error('Invalid or expired OTP token');
            } else if (error.response?.status === 400) {
                throw new Error('Invalid access token format');
            } else if (error.code === 'ECONNREFUSED') {
                throw new Error('Cannot connect to MSG91 API');
            } else {
                throw new Error('OTP verification failed. Please try again.');
            }
        }
    }

    /**
     * Get widget configuration for frontend
     * @param {string} phoneNumber - Phone number (10 digits without country code)
     * @returns {Object} Widget configuration
     */
    getWidgetConfig(phoneNumber: string) {
        if (!this.widgetId) {
            throw new Error('MSG91_WIDGET_ID not configured');
        }

        // Ensure phone number has country code
        const formattedPhone = phoneNumber.startsWith('91')
            ? phoneNumber
            : `91${phoneNumber}`;

        return {
            widgetId: this.widgetId,
            tokenAuth: this.authKey,
            identifier: formattedPhone,
            exposeMethods: true,
            captchaRenderId: '', // Optional: for captcha
            // Note: success and failure callbacks are handled on client side
        };
    }

    /**
     * Validate phone number format
     * @param {string} phoneNumber - Phone number to validate
     * @returns {boolean} True if valid
     */
    validatePhoneNumber(phoneNumber: string) {
        // Check if it's 10 digits (without country code)
        if (/^\d{10}$/.test(phoneNumber)) {
            return true;
        }

        // Check if it's 12 digits with country code (91xxxxxxxxxx)
        if (/^91\d{10}$/.test(phoneNumber)) {
            return true;
        }

        return false;
    }

    /**
     * Format phone number for MSG91 (adds country code if needed)
     * @param {string} phoneNumber - Phone number
     * @returns {string} Formatted phone number
     */
    formatPhoneNumber(phoneNumber: string) {
        // Remove any spaces, dashes, or special characters
        const cleaned = phoneNumber.replace(/[\s\-\+\(\)]/g, '');

        // If already has country code (91xxxxxxxxxx)
        if (/^91\d{10}$/.test(cleaned)) {
            return cleaned;
        }

        // If it's 10 digits, add country code
        if (/^\d{10}$/.test(cleaned)) {
            return `91${cleaned}`;
        }

        throw new Error('Invalid phone number format');
    }
}
const msg91Service = new MSG91Service();
export default msg91Service;