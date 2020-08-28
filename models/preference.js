const mongoose = require('mongoose');

// Define the model schema
const schema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: 'User', unique: true, required: true },
  translate: { type: Boolean, default: false },
  translation_lang: { type: String, default: 'none' },
  description: String,
  username: String,
  avatar: String,
  theme: {
    style: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    background: {
      type: {
        type: String,
        enum: ['none', 'image', 'color'],
        default: 'image'
      },
      color: String,
      url: { type: String, default: '' }
    },
    font_size: {
      type: String,
      enum: ['small', 'medium', 'big'],
      default: 'medium'
    }
  },
  security: {
    two_step: { type: Boolean, default: false },
    notifications: { type: Boolean, default: false }
  },
  confidentiality: {
    seen_at: {
      type: String,
      enum: ['no-one', 'everybody', 'contacts'],
      default: 'everybody'
    },
    profile_pic: {
      type: String,
      enum: ['no-one', 'everybody', 'contacts'],
      default: 'everybody'
    },
    actu: {
      type: String,
      enum: ['no-one', 'everybody', 'contacts'],
      default: 'everybody'
    },
    statuses: {
      who: {
        type: String,
        enum: ['contacts', 'except', 'only'],
        default: 'contacts'
      },
      contacts: [String]
    },
    read_confirmation: { type: Boolean, default: true },
    group_add: {
      type: String,
      enum: ['no-one', 'everybody', 'contacts'],
      default: 'contacts'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Preference', schema);