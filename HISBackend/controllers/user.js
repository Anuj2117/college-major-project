const User = require("../models/User");
const Messages = require("../models/Messages");

const updateProfile = async (req, res) => {
  const { name, phone, about, address } = req.body;

  // Validation
  if (!name || name.length < 3)
    return res
      .status(400)
      .json({ success: false, message: "Name should be minimum 3 chars" });

  try {
    await User.findByIdAndUpdate(req.user._id, {
      name: name,
      phoneNumber: phone,
      about: about,
      address: address,
    });

    return res.status(200).json({ success: true, message: "Details Updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfliePhoto = async (req, res) => {
  if (req.file) {
    await User.findByIdAndUpdate(req.user._id, {
      imgUrl: req.file.location,
    });
    return res.status(200).json({
      success: true,
      message: "Profile Photo uploaded",
      imgUrl: req.file.location,
    });
  }
  return res
    .status(400)
    .json({ success: false, message: "File is not provided" });
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "DOCTOR", active: true }).select(
      "name address gender email _id imgUrl phoneNumber"
    );

    return res.status(200).json({ success: true, doctors });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllpatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "PATIENT", active: true }).select(
      "name address gender email _id imgUrl phoneNumber"
    );

    return res.status(200).json({ success: true, patients });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getPatientByName = async (req, res) => {
  const { name } = req.params;
  try {
    const patients = await User.find({
      $text: { $search: name },
      role: "PATIENT",
      active: true,
    }).select("name address gender email _id imgUrl phoneNumber");

    return res.status(200).json({ success: true, patients });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const messageId =
      req.user._id >= receiverId
        ? req.user._id + receiverId
        : receiverId + req.user._id;
    const messages = await Messages.find({ messageId });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Invalid Request" });
  }
};

// Only for Websockt
const sendMessage = async (payload, file) => {
  const { senderId, receiverId, message } = payload;
  const messageId =
    senderId >= receiverId ? senderId + receiverId : receiverId + senderId;
  const messageDoc = await Messages.create({
    sender: senderId,
    receiver: receiverId,
    content: message,
    messageId,
    file,
  });
  return messageDoc;
};

module.exports = {
  updateProfile,
  updateProfliePhoto,
  getAllDoctors,
  getAllpatients,
  getAllMessages,
  sendMessage,
  getPatientByName,
};
