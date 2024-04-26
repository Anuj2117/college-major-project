const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "PATIENT", "DOCTOR"],
    required: true,
    default: "PATIENT",
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HisDeparments",
    required: false,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  about: {
    type: String,
    required: true,
    default: " ",
  },
  imgUrl: {
    type: String,
    required: true,
    default: "https://bootdey.com/img/Content/avatar/avatar7.png",
  },
});

UserSchema.index({ name: "text", email: "text", phoneNumber: "text" });

module.exports = mongoose.model("Hisusers", UserSchema);
