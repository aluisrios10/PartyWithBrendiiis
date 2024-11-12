const mongoose = require('mongoose');

// Define the Appointment schema
const AppointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },  // Add the time field
});

// Export the Appointment model
module.exports = mongoose.model('Appointment', AppointmentSchema);
