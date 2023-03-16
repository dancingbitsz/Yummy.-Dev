const  Joi = require('joi');
// import { ErrorController } from "../../core/ErrorController";
// const EC = new ErrorController();

exports.jois = {
    bookTablePayload: Joi.object().keys({
        name: Joi.string().required(),
        email:Joi.string().email().required(),
        phone: Joi.number().required(),
        bookingDate:Joi.string().required(),
        bookingTime:Joi.string().required(),
        people: Joi.number().required(),
        message:Joi.string().required(),
    }),
}
