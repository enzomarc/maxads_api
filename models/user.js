const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
    username: { type: String },
    prefix: { type: String, required: true },
    phone: { type: String, required: true, unique: true, minlength: 9, maxlength: 15 },
    active: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    preferences: { unique: true, type: mongoose.Types.ObjectId, ref: 'Preference' },
    discussions: [{ type: mongoose.Types.ObjectId, ref: 'Discussion' }],
    lastConnection: Date,
    lastVerification: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', schema);