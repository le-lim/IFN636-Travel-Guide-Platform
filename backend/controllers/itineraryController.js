const Itinerary = require('../models/Itinerary');

// ─── CREATE ────────────────────────────────────────────────────────────────────
const createItinerary = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;

    const itinerary = await Itinerary.create({
      title,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    res.status(201).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── READ ALL ──────────────────────────────────────────────────────────────────
const getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── READ ONE ──────────────────────────────────────────────────────────────────
const getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE ────────────────────────────────────────────────────────────────────
const updateItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── DELETE ────────────────────────────────────────────────────────────────────
const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
};