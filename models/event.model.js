const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:
  {
    type: String,
    required: [true, 'Title of the event is required'],
    trim: true
  },
  description:
  {
    type: String,
    required: [true, 'Description of the event is required'],
    trim: true
  },
  category:
  { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  date:
  { 
    type: Date, required: [true, 'Date of the event is required'] },
  city:
  {
     type: String, required: [true, 'Address of the event is required'], trim: true },
  venue:
  { 
    type: String, required: [true, 'Name of venue of the event is required'], trim: true },
  capacity:
  { 
    type: Number, required: [true, 'Capacity of the event is required'], min: 1 },
  organizer:
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Organizer of the event is required'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema) || mongoose.models.Event;