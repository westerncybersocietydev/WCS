"use server"
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  uwoEmail: { type: String, required: true },
  message: { type: String, required: true },
}, { collection: 'contacts' });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;