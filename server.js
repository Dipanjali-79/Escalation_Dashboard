const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Escalation = require('./models/Escalation');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
// Get all escalations
app.get('/api/escalations', async (req, res) => {
    try {
        const escalations = await Escalation.find().sort({ createdAt: -1 });
        res.status(200).json(escalations);
    } catch (err) {
        console.error("Error fetching escalations:", err);
        res.status(500).json({ message: err.message });
    }
});

// Create a new escalation
app.post('/api/escalations', async (req, res) => {
    const escalation = new Escalation(req.body);
    try {
        const newEscalation = await escalation.save();
        res.status(201).json(newEscalation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an escalation
app.delete('/api/escalations/:id', async (req, res) => {
    try {
        await Escalation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Escalation deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
