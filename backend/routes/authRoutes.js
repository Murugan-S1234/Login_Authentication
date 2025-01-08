const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// Register new user (email/password)
router.post('/register', async (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) return res.status(400).json({ error: 'Fields missing' });

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ emailOrPhone });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ emailOrPhone, password: hashedPassword, authType: 'email' });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login user (email/password)
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Google login or save new user from Google Firebase
router.post("/saveUser", async (req, res) => {
  const { email, firebaseUid } = req.body;

  if (!email || !firebaseUid) return res.status(400).json({ error: 'Missing email or Firebase UID' });

  try {
    // Check if user already exists based on email
    let user = await User.findOne({ emailOrPhone: email });

    if (!user) {
      // Create new user for Google login
      user = new User({
        emailOrPhone: email,
        firebaseUid: firebaseUid,  // Store Firebase UID for Google users
        authType: 'google'         // Set auth type to 'google'
      });
      await user.save();
      return res.status(201).json({ message: "User created and saved successfully" });
    } else {
      // If user already exists, check if Firebase UID is saved
      if (!user.firebaseUid) {
        // If Firebase UID is not present, update it
        user.firebaseUid = firebaseUid;
        user.authType = 'google';  // Set auth type to google if not already
        await user.save();
      }
      return res.status(200).json({ message: "User already exists" });
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: "Error saving user" });
  }
});

module.exports = router;
