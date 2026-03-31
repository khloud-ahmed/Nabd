const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { registerSchema, loginSchema } = require("../controllers/validations/authValidation");
const { sendWelcomeEmail } = require("../services/emailService");
//register
//joi validation for register 
const register = async (req, res, next) => {
try{
const { error, value } = registerSchema.validate(req.body, {
abortEarly: false,
stripUnknown: true,
})

if (error) {
    return res.status(400).json({ msg: "Validation Error"});
}

//get data from validated value
const { username, email, password, role, phone, gender, dateOfBirth, specialization, fees } = value;
//user found or not 
const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ msg: "Account Already Exist" });
    //hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // Role validation
    if (role === "patient") {
      if (!phone || !gender || !dateOfBirth)
        return res.status(400).json({ msg: "Validation Error", errors: ["phone, gender, and dateOfBirth are required for patients"] });
    }

    if (role === "doctor") {
      if (!specialization || fees === undefined)
        return res.status(400).json({ msg: "Validation Error", errors: ["specialization and fees are required for doctors"] });
    }

    

    
//INSERT TO DB
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });

    if (role === "patient") {
      await Patient.create({ user: user._id, phone, gender, dateOfBirth });
    }

    if (role === "doctor") {
      await Doctor.create({ user: user._id, specialization, fees });
    }
//RESPOND 
    res.status(201).json({
      msg: "Done Created User",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
//login
//joi validation for login
const login = async (req, res, next) => {
try{
const { error, value } = loginSchema.validate(req.body, {
abortEarly: false,
stripUnknown: true,
})

if (error) {
    return res.status(400).json({ msg: "Validation Error"});
}
//get data from validated value
const { email, password } = value;
//check if user exist or not
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "Account Not Found, Please Register" });
//COMPARE PASSWORD & HASH PASSWORD
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).json({ msg: "Invalid Password" });
//CREATE TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "Success Login",
      token,
    });
  } catch (error) {
    next(error);
  }
};
//logout 
const logout = async (req,res ,next) =>{
  try{
    res.status(200).json({
      msg: "Logged out successfully",
    });

  }
  catch(error){
    next(error);
  }

    //send welcome email after registration
if (role === "patient") {
  await Patient.create({ user: user._id, phone, gender, dateOfBirth });
  // Send welcome email
  await sendWelcomeEmail(user._id, username, email);
}

if (role === "doctor") {
  await Doctor.create({ user: user._id, specialization, fees });
  // Send welcome email
  await sendWelcomeEmail(user._id, username, email);
}
}




module.exports = { register, login , logout };


