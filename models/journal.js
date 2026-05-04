const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  arrivalDate: {
    type: Date,
    required: [true, 'Arrival date is required']
  },
  departureDate: {
    type: Date,
    required: [true, 'Departure date is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience description is required'],
    trim: true,
    minlength: [10, 'Experience must be at least 10 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Journal', journalSchema);
