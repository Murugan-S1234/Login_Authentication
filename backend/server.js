const express = require('express');
// const https = require('https');
// const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// SSL options
// const options = {
//     key: fs.readFileSync('./ssl/server.key'),
//     cert: fs.readFileSync('./ssl/server.cert'),
// };

const app = express();

// CORS and COOP/COEP headers middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');  // Allow same-origin interaction
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Required if COOP is 'same-origin'
  next();
});


const corsOptions = {
  origin: 'https://login-authentication-1-uqyn.onrender.com',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));




app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);



// Start server
// const PORT = process.env.PORT || 5000;
// https.createServer(options, app).listen(PORT, () => {
//     console.log(`Server is running on https://localhost:${PORT}`);
// });

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
