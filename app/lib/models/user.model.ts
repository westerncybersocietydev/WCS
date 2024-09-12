"use server"
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  uwoEmail: { type: String, unique: true, required: true },
  preferredEmail: { type: String },
  currentYear: { type: String, required: true },
  program: { type: String, required: true },
  plan: { type: String, required: true },
  password: { type: String, required: true },
  myEvents: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Event' } ]
}, { collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;