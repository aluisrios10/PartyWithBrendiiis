// Load environment variables from .env file
require('dotenv').config();

// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

// Models for Quote and Appointment
const Quote = require('./models/Quote');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 3000;  // Use environment variable for cloud services, fallback to 3000 locally

// Set up multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate unique filename
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Middleware
app.use(express.static('public'));  // Serve static files from the 'public' folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // Add this for JSON support

// Serve the HTML form for the front-end
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB using environment variable for secure connection string
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/brendaLarranaga', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Quote route (handles form data and file upload)
app.post('/quote', upload.single('inspiration-image'), async (req, res) => {
  // Destructure form data from the request body
  const { name, email, phone, eventType, details } = req.body;

  // Check for uploaded file (inspiration image)
  const inspirationImage = req.file ? req.file.path : null;  // If there's a file, use the file path

  // Log request details for debugging
  console.log('Request Body:', req.body);  // Log the form data
  console.log('Uploaded File:', req.file);  // Log the uploaded file data

  // Validate required fields
  if (!name || !email || !phone || !eventType || !details) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Create a new quote document and save to MongoDB
    const quote = new Quote({
      name,
      email,
      eventType,
      details,
      phone,
      inspirationImage  // Store image file path in MongoDB
    });

    await quote.save();  // Save the quote to the database
    res.send('Quote request received and saved');
  } catch (err) {
    res.status(500).send('Error saving quote');
    console.error(err);
  }
});

// Appointment route (for scheduling appointments)
app.post('/appointment', async (req, res) => {
  const { name, email, phone, date, time } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !date || !time) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Create a new appointment document and save to MongoDB
    const appointment = new Appointment({
      name,
      email,
      phone,
      date,
      time  // Store the time field in the database
    });

    await appointment.save();  // Save the appointment to MongoDB
    res.send('Appointment scheduled and saved');
  } catch (err) {
    res.status(500).send('Error scheduling appointment');
    console.error(err);
  }
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
