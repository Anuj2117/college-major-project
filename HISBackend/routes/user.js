const express = require("express");

const {
  getAllpatients,
  updateProfile,
  updateProfliePhoto,
  getAllDoctors,
  getAllMessages,
  getPatientByName,
} = require("../controllers/user");
const { isPatient, isDoctor } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");

const router = express.Router();

// ALL
router.put("/update", updateProfile);
router.put("/profile-photo", upload.single("profile"), updateProfliePhoto);

// MESSAGE ROTES
router.get("/messages/all/:receiverId", getAllMessages);

// DOCTOR ROUTES
router.get("/doctors/all", isPatient, getAllDoctors);

// PATIENT ROUTES
router.get("/patients/all", isDoctor, getAllpatients);
router.get("/patients/:name", isDoctor, getPatientByName);

module.exports = router;
