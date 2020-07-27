const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  phone: { type: String, required: true },
  code: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Verification', schema);