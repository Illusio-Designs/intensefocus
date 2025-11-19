import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";

const validate =
    (schema: ObjectSchema<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
            // console.log("validate " + req.body.toString());
            const { error } = schema.validate(req.body);
            // console.log("validate " + error);
            if (!error) {
                next();
            } else {
                const errors = error?.details.map((err) => ({
                    field: err.path.join(', '),
                    message: err.message
                }));
                console.log(errors);
                res.status(httpStatus.BAD_REQUEST).json({ validation: errors });
            }
        };

export default validate;