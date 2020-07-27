const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
    username: { type: String },
    phone: { type: String, required: true, minlength: 9, maxlength: 15 },
    active: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    preferences: { type: mongoose.Types.ObjectId, ref: 'Preference' },
    lastConnection: Date,
    lastVerification: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', schema);