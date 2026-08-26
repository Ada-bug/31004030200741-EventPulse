const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const AppError = require('../utils/AppError')
const Registration = require("../models/registration.model");
const Event = require("../models/event.model");

// POST /api/registrations
const registerForEvent = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const eventId = req.body.event;

  // Validate event ID
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  // Check event exists
  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  // Prevent duplicate registration
  const existing = await Registration.findOne({
    event: eventId,
    attendee: userId,
  });

  if (existing) {
    throw new AppError("You are already registered for this event", 409);
  }

  // Check capacity
  const currentCount = await Registration.countDocuments({
    event: eventId,
  });

  if (currentCount >= event.capacity) {
    throw new AppError("This event is full", 400);
  }

  // Create registration
  const registration = await Registration.create({
    event: eventId,
    attendee: userId,
  });

  return res.status(201).json({
    status: "success",
    data: registration,
  });
});


// GET /api/registrations/my
const getMyRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const registrations = await Registration
    .find({ attendee: userId })
    .populate("event");

  return res.status(200).json({
    status: "success",
    data: registrations,
  });
});


// DELETE /api/registrations/:id
const cancelRegistration = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const registrationId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(registrationId)) {
    throw new AppError("Invalid registration ID", 400);
  }

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    throw new AppError("Registration not found", 404);
  }

  // Ownership check
  if (registration.attendee.toString() !== userId) {
    throw new AppError("You can only cancel your own registration", 403);
  }

  await registration.deleteOne();

  return res.status(200).json({
    status: "success",
    message: "Registration cancelled successfully",
  });
});


module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};