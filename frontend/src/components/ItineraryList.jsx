import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ItineraryList = ({ itineraries, setItineraries, onEdit, onCreateNew }) => {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      await axiosInstance.delete(`/api/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItineraries((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert('Failed to delete itinerary.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      {/* Header row — stacks on very small screens */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#4E3776]">My Itineraries</h1>
        <button
          onClick={onCreateNew}
          className="bg-[#947DC4] text-white px-4 py-2 rounded hover:bg-[#3b2a59] transition-colors font-mono text-sm sm:text-base"
        >
          + Create New
        </button>
      </div>

      {itineraries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No itineraries yet.</p>
          <p className="text-sm mt-1">Click "Create New" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary._id}
              className={`bg-white border rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-300 ${
                expandedId === itinerary._id
                  ? 'border-blue-400 ring-1 ring-blue-100'
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              {/* Card Header: click to expand */}
              <div
                className="cursor-pointer"
                onClick={() => toggleExpand(itinerary._id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-[#4E3776] truncate">
                      {itinerary.title}
                    </h2>
                    {/* Dates stack on mobile, sit side by side on larger screens */}
                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-2 text-sm text-gray-500 gap-1">
                      <p><span className="font-medium">Starts:</span> {formatDate(itinerary.startDate)}</p>
                      <p><span className="font-medium">Ends:</span> {formatDate(itinerary.endDate)}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xl flex-shrink-0">
                    {expandedId === itinerary._id ? '−' : '+'}
                  </span>
                </div>
              </div>

              {/* Expandable detail section */}
              {expandedId === itinerary._id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-[#F2EFF8] rounded-lg p-4">
                    <p className="text-[#947DC4] text-sm font-semibold italic">
                      📍 No destinations have been added to this itinerary yet.
                      Explore our travel guides to start planning your stops!
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 sm:mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(itinerary);
                  }}
                  className="flex-1 text-sm font-semibold bg-[#B6A8D8]/50 px-3 py-2 rounded-lg font-itinerary"
                >
                  Edit Settings
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(itinerary._id);
                  }}
                  className="flex-1 text-sm font-semibold bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition font-itinerary"
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