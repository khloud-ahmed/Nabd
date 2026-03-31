//REQUIRE JOI 
const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string().valid("patient", "doctor", "admin").default("patient"),

  phone: Joi.string().optional(),
  gender: Joi.string().valid("male", "female").optional(),
  dateOfBirth: Joi.date().optional(),

  specialization: Joi.string().optional(),
  fees: Joi.number().min(0).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };