const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: String,
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Hisusers",
    },
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Hisusers",
    },
    messageId: {
      type: String,
    },
    file: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages2", MessageSchema);
