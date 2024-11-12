const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, },  // Optional phone number
    eventType: { type: String, required: true },
    details: { type: String, required: true },
    inspirationImage: { type: String }  // Optional image URL
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
