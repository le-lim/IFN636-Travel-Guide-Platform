const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
} = require('../controllers/itineraryController');

router.post('/',      protect, createItinerary);
router.get('/',       protect, getItineraries);
router.get('/:id',    protect, getItinerary);
router.put('/:id',    protect, updateItinerary);
router.delete('/:id', protect, deleteItinerary);

module.exports = router;