const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailOrPhone: { type: String, unique: true, required: true },
  password: { type: String }, 
  firebaseUid: { type: String },  
  authType: { 
    type: String,
    enum: ['email', 'google'],
    default: 'email' 
  },
});

module.exports = mongoose.model('User', userSchema);
