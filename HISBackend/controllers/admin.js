const User = require("../models/User");
const Deparment = require("../models/Department");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
// Create doctor account
const createDoctor = async (req, res) => {
  const { name, email, phoneNumber, gender, departmentId } = req.body;

  // get the random password
  const password = uuidv4();

  // if doctor already exits
  const doctor = await User.findOne({ email });

  if (doctor) {
    return res
      .status(400)
      .json({ success: false, message: "Email already in use" });
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 6);

  // create one account
  const newDoctor = await User.create({
    name,
    email,
    gender,
    phoneNumber,
    password: hashedPassword,
    role: "DOCTOR",
    departmentId: departmentId,
  });

  // send activation email
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Prep
  const token = jwt.sign(
    {
      _id: newDoctor._id,
      email: newDoctor.email,
      name: newDoctor.name,
    },
    process.env.TOKEN_SECRET
  );

  const url = `http://localhost:3001/auth/verify/${token}`;

  let mailDetails = {
    from: "a.m2001nov@gmail",
    to: email,
    subject: "Activate your Account",
    text: `Hey Doctor ${name}  \n
    Your account is created for our portal you can login using following credetials \n
    email: ${email} \n
    password: ${password} \n

    In order to login first you have to activate your account using the following link

    \n ${url} `,
  };

  // sending the email
  mailTransporter.sendMail(mailDetails);
  console.log(url);

  return res.status(200).json({
    success: true,
    message: "Email has been sent to activate your account",
  });
};

// View All the doctors
const getAllDoctors = async (req, res) => {
  const doctors = await User.find({ role: "DOCTOR" }).populate("departmentId");
  return res.status(200).json({ success: true, doctors });
};

// Creaet Deparment
const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    await Deparment.create({ name });

    return res
      .status(200)
      .json({ success: true, message: "Deparment Created" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// get all department
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Deparment.find({});

    return res.status(200).json({ success: true, departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  createDepartment,
  getAllDepartments,
};
