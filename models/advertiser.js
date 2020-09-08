const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  phone: { type: String, required: true, unique: true, minlength: 9, maxlength: 15 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    country: String,
    city: String
  },
  type: {
    type: String,
    enum: ['private', 'company'],
    required: true
  },
  active: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  lastConnection: Date,
  lastVerification: Date,
}, { timestamps: true });

module.exports = mongoose.model('Advertiser', schema);