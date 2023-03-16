const Joi = require("joi");

exports.jois = {
  signUpPayload: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().optional(null, ""),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    access_token: Joi.string().optional(null, "")
  }),
  signInPayload: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};
