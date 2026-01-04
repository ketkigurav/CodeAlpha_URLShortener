const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// IMPORTANT: Ensure the filename in your folder is 'url.js' (lowercase)
module.exports = mongoose.model('Url', urlSchema);