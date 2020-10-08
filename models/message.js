const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  discussion: { type: mongoose.Types.ObjectId, ref: 'Discussion' },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'video', 'audio', 'contact', 'money'],
    default: 'text'
  },
  content: { type: String, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', schema);