const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');
const {protect} = require('../middleware/authMiddleware'); // already exists in the starter

// ─── CREATE ────────────────────────────────────────────────────────────────────
// POST /api/itineraries
// Body: { title, destination, startDate, endDate, description, activities }
router.post('/', protect, async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;

    const itinerary = await Itinerary.create({
      title,
      startDate,
      endDate,
      createdBy: req.user._id, // req.user is set by the protect middleware after JWT check
    });

    res.status(201).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ─── READ ALL (only this user's itineraries) ───────────────────────────────────
// GET /api/itineraries
router.get('/', protect, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ createdBy: req.user._id }).sort({
      createdAt: -1, // newest first
    });

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── READ ONE ──────────────────────────────────────────────────────────────────
// GET /api/itineraries/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      createdBy: req.user._id, // prevents users from reading each other's data
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── UPDATE ────────────────────────────────────────────────────────────────────
// PUT /api/itineraries/:id
// Body: any fields you want to change
router.put('/:id', protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id, // only the owner can update
      },
      req.body,
      {
        new: true,          // return the updated document, not the old one
        runValidators: true, // re-run schema validation on the new values
      }
    );

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ─── DELETE ────────────────────────────────────────────────────────────────────
// DELETE /api/itineraries/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id, // only the owner can delete
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;