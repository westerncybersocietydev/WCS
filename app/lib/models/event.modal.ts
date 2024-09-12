"use server"
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
}, { collection: 'events' });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;