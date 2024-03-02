const express = require("express");

const {
  getAllpatients,
  updateProfile,
  updateProfliePhoto,
  getAllDoctors,
  getAllMessages,
  getPatientByName,
  openSlot,
  getAllDoctorSlots,
  deleteSlot,
} = require("../controllers/user");
const { isPatient, isDoctor } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");

const router = express.Router();

// ALL
router.put("/update", updateProfile);
router.put("/profile-photo", upload.single("profile"), updateProfliePhoto);

router.get("/messages/all/:receiverId", getAllMessages);

router.get("/doctors/all", isPatient, getAllDoctors);

router.get("/patients/all", isDoctor, getAllpatients);
router.get("/patients/:name", isDoctor, getPatientByName);

// SLOTS
router.post("/doctors/slots/open", isDoctor, openSlot);
router.get("/doctors/slots/all", isDoctor, getAllDoctorSlots);
router.delete("/doctors/slots/delete/:slotId", isDoctor, deleteSlot);

module.exports = router;
