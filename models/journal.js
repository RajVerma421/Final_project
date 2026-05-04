const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  destination: String,
  arrivalDate: Date,
  departureDate: Date,
  experience: String,
  rating: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
