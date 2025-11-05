// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Connection error:', err));

// Donor schema and model
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  contact: { type: String, required: true },
  city: { type: String, required: true }
});

const Donor = mongoose.model('Donor', donorSchema);

// Add a new donor
app.post('/donors', async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    const savedDonor = await newDonor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all donors (or filter with query)
app.get('/donors', async (req, res) => {
  try {
    const donors = await Donor.find(req.query);
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a donor by ID
app.delete('/donors/:id', async (req, res) => {
  try {
    const deleted = await Donor.findByIdAndDelete(req.params.id);
    if(!deleted) return res.status(404).json({ message: 'Donor not found' });
    res.json({ message: 'Donor deleted', deleted });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
