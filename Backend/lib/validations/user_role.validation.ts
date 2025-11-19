
import Joi from 'joi';

const userRoleSchema: Joi.ObjectSchema = Joi.object({
    _id: Joi.string().optional().allow(''),
    role: Joi.string().required(),
    allowedActions: Joi.array<Object>().required(),
});

export default userRoleSchema;