const mongoose = require("mongoose");

const Appointment = new mongoose.Schema({
  openedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Hisusers",
    required: true,
  },
  bookedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Hisusers",
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model("appointemtnshis2", Appointment);
