const mongoose = require("mongoose");

const deparmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("HisDeparments", deparmentSchema);
