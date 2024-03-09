const express = require("express");
const { body } = require("express-validator");
const {
  login,
  signup,
  verifyAccount,
  changePassword,
} = require("../controllers/auth");

const { isLoggedIn, validateBody } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", login);
router.post(
  "/signup",
  body("name").exists().withMessage("Name is Required"),
  body("email").exists().isEmail().withMessage("Invalid Email"),
  body("gender")
    .exists()
    .isIn(["male", "female", "others"])
    .withMessage("Invlaid Gender"),
  body("phoneNumber")
    .exists()
    .isLength({ min: 10 })
    .withMessage("Invalid Phone"),
  body("password").exists().isStrongPassword().withMessage("Weak Password"),
  validateBody,
  signup
);
router.get("/verify/:token", verifyAccount);

router.put("/change-password", isLoggedIn, changePassword);

module.exports = router;
