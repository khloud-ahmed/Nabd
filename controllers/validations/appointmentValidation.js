const Joi = require("joi");

const createAppointmentSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required() ,

  date: Joi.date().greater("now"),

  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
   ,

  endTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    ,
});

const cancelAppointmentSchema = Joi.object({
  appointmentId: Joi.string().hex().length(24).required(),
});

module.exports = { createAppointmentSchema, cancelAppointmentSchema };