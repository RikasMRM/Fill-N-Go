//Validation
const Joi = require("@hapi/joi");

//Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    Name: Joi.string().min(6).required(),
    Email: Joi.string().min(6).required().email(),
    Password: Joi.string().min(6).required(),
    Address: Joi.string().min(3).required(),
  });
  return schema.validate(data);
};

//Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

//Forgot Password Validation
const ForgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.ForgotPasswordValidation = ForgotPasswordValidation;
