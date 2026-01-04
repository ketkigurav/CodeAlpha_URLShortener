require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Url = require('./models/url');

const app = express();

// 1. MIDDLEWARE (Crucial: Must be before routes)
app.use(express.json());
app.use(express.static('.')); 

// 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Locally...'))
    .catch(err => console.log('❌ Connection Error:', err));

// 3. API ROUTE: Shorten URL
app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    try {
        // Create unique 6-character code [cite: 26]
        const shortCode = nanoid(6);
        
        // Save to Database [cite: 27]
        const newUrl = new Url({ longUrl, shortCode });
        await newUrl.save();
        
        res.json({
            original: longUrl,
            short: `http://localhost:3000/${shortCode}`
        });
    } catch (err) {
        res.status(500).json('Server Error');
    }
});

// 4. REDIRECT ROUTE: Handles short links [cite: 28]
app.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.code });
        if (url) {
            // Redirect to original URL if found [cite: 28]
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('URL not found');
        }
    } catch (err) {
        res.status(500).json('Server Error');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:3000`));