const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true
  },
  travelStyle: {
    type: String,
    required: [true, 'Travel style is required'],
    enum: ['Adventure', 'Relaxation', 'Cultural', 'Business', 'Backpacking', 'Luxury']
  },
  favoriteContinent: {
    type: String,
    required: [true, 'Favorite continent is required'],
    enum: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Australia', 'Antarctica']
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
