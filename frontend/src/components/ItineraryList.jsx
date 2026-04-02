import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// ─── WHAT IS THIS FILE? ────────────────────────────────────────────────────────
// This component receives data from Itineraries.jsx via "props".
// Props are like arguments passed into a function — read-only inside this file.
// This file's job: display the cards, handle delete, trigger edit/create.
// ──────────────────────────────────────────────────────────────────────────────

// The { itineraries, setItineraries, onEdit, onCreateNew } in the brackets
// is "destructuring props" — a shorthand for receiving values passed from the parent.
const ItineraryList = ({ itineraries, setItineraries, onEdit, onCreateNew }) => {
  const { user } = useAuth();

  // Handles deleting an itinerary when user clicks the Delete button
  const handleDelete = async (id) => {
    // Ask for confirmation before deleting — good UX practice
    if (!window.confirm('Are you sure you want to delete this itinerary?')) return;

    try {
      await axiosInstance.delete(`/api/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Remove the deleted item from the list without fetching from backend again.
      // filter() creates a new array that only keeps items where the condition is true.
      setItineraries((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert('Failed to delete itinerary.');
    }
  };

  // A small helper to format dates nicely e.g. "1 June 2025"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Header row: title on the left, button on the right */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Itineraries</h1>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create New
        </button>
      </div>

      {/* Conditional rendering: if no itineraries exist, show empty state message */}
      {itineraries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No itineraries yet.</p>
          <p className="text-sm mt-1">Click "Create New" to get started.</p>
        </div>
      ) : (
        // If itineraries exist, map() loops through the array and creates a card for each one.
        // Think of map() like a for-loop that returns JSX.
        // The "key" prop is required by React to track which card is which efficiently.
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Card content */}
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {itinerary.title}
              </h2>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-600">Start:</span>{' '}
                {formatDate(itinerary.startDate)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-600">End:</span>{' '}
                {formatDate(itinerary.endDate)}
              </p>

              {/* Edit and Delete buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onEdit(itinerary)}
                  className="flex-1 text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(itinerary._id)}
                  className="flex-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryList;