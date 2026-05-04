const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  nationality: String,
  travelStyle: String,
  favoriteContinent: String
});

module.exports = mongoose.model('User', userSchema);
