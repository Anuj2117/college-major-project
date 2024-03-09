const express = require("express");
const { body } = require("express-validator");
const {
  createDoctor,
  getAllDoctors,
  createDepartment,
  getAllDepartments,
} = require("../controllers/admin");

const { validateBody } = require("../middlewares/auth");
const router = express.Router();

router.get("/", getAllDoctors);

router.post(
  "/doctor/create",
  body("email").exists().withMessage("Email is Required"),
  body("name").exists().isLength({ min: 4 }).withMessage("Name is Required"),
  body("phoneNumber").exists().withMessage("Phone Number is Required"),
  body("departmentId").exists().withMessage("Deparmtent Id is Required"),
  body("gender")
    .exists()
    .isIn(["male", "female", "others"])
    .withMessage("Invalid Gender"),
  validateBody,
  createDoctor
);

router.get("/departments", getAllDepartments);

router.post(
  "/department/create",
  body("name").exists().withMessage("Department Name is Required"),
  validateBody,
  createDepartment
);

module.exports = router;
