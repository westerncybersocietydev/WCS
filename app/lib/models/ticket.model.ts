"use server";
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    required: true,
    enum: ['free', 'pending', 'completed', 'failed'],
    default: 'pending'
  },
  paypalOrderId: { type: String }, // PayPal order ID if paid
  amountPaid: { type: Number, default: 0 }, // Amount paid in CAD (0 for free tickets)
  ticketNumber: { type: String, unique: true, required: true }, // Unique ticket identifier
  createdAt: { type: Date, default: Date.now },
  reminderSent: { type: Boolean, default: false }, // Track if reminder email was sent
  qrCode: { type: String }, // Optional: QR code data for check-in
}, { collection: 'tickets' });

// Index for faster lookups
ticketSchema.index({ userId: 1, eventId: 1 });
ticketSchema.index({ ticketNumber: 1 });

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

export default Ticket;

