const Message = require("../models/message.model");
const asyncHandler = require('../utils/asyncHandler')

// POST /api/announcements
const createAnnouncement = asyncHandler(async (req, res) => {
  const { eventId, text } = req.body;

  const io = req.app.get("io");

  const message = await Message.create({
    event: eventId,
    sender: req.user.userId,
    text,
  });


  io.to(eventId).emit("announcement", message);


  res.status(201).json({ status: "success", data: message });
});

// GET /api/announcements/:id
const getAnnouncements = asyncHandler(async (req, res) => {

  const { eventId } = req.params;


  const messages = await Message.find({
    event: eventId,
  })
  .populate("sender", "name email")
  .sort({ createdAt: 1 });

  res.status(200).json({ status: "success", data: messages });

});

module.exports = {
    createAnnouncement,
    getAnnouncements
}