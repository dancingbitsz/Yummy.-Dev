const  Joi = require('joi');
// import { ErrorController } from "../../core/ErrorController";
// const EC = new ErrorController();

exports.jois = {
    registrationPayload: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().optional().allow(null, ""),
        email:Joi.string().email().required(),
        password:Joi.string().required(),
    }),

    loginPayload: Joi.object().keys({
        email:Joi.string().email().required(),
        password:Joi.string().required(),
    }),
    contactUsPayload: Joi.object().keys({
        email:Joi.string().email().required(),
        name: Joi.string().optional().allow(null, ""),
        subject: Joi.string().required(),
        message:Joi.string().required(),
    }),
}
