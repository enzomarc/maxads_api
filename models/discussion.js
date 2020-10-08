const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  from: { type: mongoose.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Types.ObjectId, ref: 'User' },
  messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

module.exports = mongoose.model('Discussion', schema);