import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// ─── WHAT IS THIS FILE? ────────────────────────────────────────────────────────
// This is the modal popup form used for BOTH create and edit.
// How it knows which mode it's in:
//   - editingItinerary is null → Create mode (blank form)
//   - editingItinerary has data → Edit mode (pre-filled form)
// ──────────────────────────────────────────────────────────────────────────────

const ItineraryForm = ({ itineraries, setItineraries, editingItinerary, onClose }) => {
  const { user } = useAuth();

  // These three useState hooks track what the user types into the form fields.
  // Each input field is "controlled" — its value is always tied to these state variables.
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // useEffect runs when editingItinerary changes.
  // If we're in edit mode, pre-fill the form fields with existing data.
  // If we're in create mode (null), reset all fields to empty.
  useEffect(() => {
    if (editingItinerary) {
      setTitle(editingItinerary.title);
      // The date from MongoDB comes as "2025-06-01T00:00:00.000Z"
      // We slice the first 10 characters to get "2025-06-01" which the date input expects
      setStartDate(editingItinerary.startDate.slice(0, 10));
      setEndDate(editingItinerary.endDate.slice(0, 10));
    } else {
      setTitle('');
      setStartDate('');
      setEndDate('');
    }
  }, [editingItinerary]);

  const handleSubmit = async (e) => {
    // e.preventDefault() stops the page from refreshing when form is submitted
    // (default browser behaviour we don't want in React)
    e.preventDefault();

    try {
      if (editingItinerary) {
        // ── EDIT MODE: send a PUT request with the updated data ──
        const response = await axiosInstance.put(
          `/api/itineraries/${editingItinerary._id}`,
          { title, startDate, endDate },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        // Update the list in place: map() goes through each item,
        // replaces the one that was edited, keeps everything else the same.
        setItineraries((prev) =>
          prev.map((item) =>
            item._id === editingItinerary._id ? response.data : item
          )
        );
      } else {
        // ── CREATE MODE: send a POST request with the new data ──
        const response = await axiosInstance.post(
          '/api/itineraries',
          { title, startDate, endDate },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        // Add the newly created itinerary to the top of the list
        setItineraries((prev) => [response.data, ...prev]);
      }

      onClose(); // close the modal after success
    } catch (error) {
      alert('Failed to save itinerary.');
    }
  };

  return (
    // The outer div is the dark overlay behind the modal.
    // "fixed inset-0" means it covers the entire screen.
    // Clicking the overlay (not the white box) closes the modal.
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* The white modal box itself.
          e.stopPropagation() prevents clicks INSIDE the box from
          bubbling up to the overlay and accidentally closing it. */}
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
        style={{ border: '1px solid #4E3776', boxShadow: '0 4px 4px rgba(0,0,0,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title changes depending on mode */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 "
            style={{ color: '#4E3776'}}>
          {editingItinerary ? 'Edit Itinerary' : 'Create New Itinerary'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ color: '#4E3776' }}>
              Itinerary Name
            </label>
            {/* value={title} ties the input to state.
                onChange updates state every time the user types a character. */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Europe Summer Trip"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#F2EFF8' }}
            />
          </div>

          {/* Start date field — type="date" gives the browser calendar picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ color: '#4E3776' }}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#F2EFF8' }}
            />
          </div>

          {/* End date field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ color: '#4E3776' }}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#F2EFF8' }}
            />
          </div>

          {/* Button row */}
          <div className="flex gap-3 mt-2 font-itinerary ">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm "
              style={{
                backgroundColor: '#B6A8D8',
                color: '#F2EFF8',
                letterSpacing: '0.05em',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium font-itinerary"
              style={{
                backgroundColor: '#B6A8D8',
                color: '#F2EFF8',
                letterSpacing: '0.05em',
              }}
            >
              {editingItinerary ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryForm;