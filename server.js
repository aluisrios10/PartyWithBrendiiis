const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const Quote = require('./models/Quote'); // Quote model
const Appointment = require('./models/Appointment'); // Appointment model

const app = express();
const PORT = process.env.PORT || 3000;  // Use environment variable PORT for cloud services, fallback to 3000 locally

// Set up multer storage configuration
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
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this for JSON support

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB (use environment variable for deployment)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/brendaLarranaga')  // Use environment variable for MongoDB URI
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Quote route (with file upload handling)
app.post('/quote', upload.single('inspiration-image'), async (req, res) => {
  // Destructure form data
  const { name, email, phone, eventType, details } = req.body;

  // Check for uploaded file (inspiration image)
  const inspirationImage = req.file ? req.file.path : null;  // If there's a file, use the file path

  // Log request details for debugging
  console.log('Request Body:', req.body);  // Log the form data
  console.log('Uploaded File:', req.file);  // Log the uploaded file data

  // Check if all required fields are present
  if (!name || !email || !phone || !eventType || !details) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Create new quote document
    const quote = new Quote({
      name,
      email,
      eventType,
      details,
      phone,
      inspirationImage  // Store image file path in MongoDB
    });

    // Save the quote to the database
    await quote.save();
    res.send('Quote request received and saved');
  } catch (err) {
    res.status(500).send('Error saving quote');
    console.error(err);
  }
});

// Create new appointment document
app.post('/appointment', async (req, res) => {
  const { name, email, phone, date, time } = req.body;  // Destructure the data from the request body

  // Check if all required fields are present
  if (!name || !email || !phone || !date || !time) {
      return res.status(400).send('Missing required fields');
  }

  try {
      // Create a new appointment document including the time field
      const appointment = new Appointment({
          name,
          email,
          phone,
          date,
          time  // Save the time field in the database
      });
      
      await appointment.save();  // Save to MongoDB
      res.send('Appointment scheduled and saved');
  } catch (err) {
      res.status(500).send('Error scheduling appointment');
      console.error(err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
