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
  description: { type: String, default: "This is a brief overview of who I am. While it may not capture everything, it provides a good sense of my character and approach." },
  avatar: { type: String, default: "/a1.png" },
  linkedin: { type: String },
  website: { type: String },
  password: { type: String, required: true },
  myEvents: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Event' } ]
}, { collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;