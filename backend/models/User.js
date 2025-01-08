const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailOrPhone: { type: String, unique: true, required: true },  // The unique identifier (email or phone number)
  password: { type: String },  // Password for email login
  firebaseUid: { type: String },  // Firebase UID for Google login
  authType: { 
    type: String,
    enum: ['email', 'google'],
    default: 'email' // Used to differentiate between Firebase/Google or email login
  },
});

module.exports = mongoose.model('User', userSchema);
