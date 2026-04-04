import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ItineraryList = ({ itineraries, setItineraries, onEdit, onCreateNew }) => {
  const { user } = useAuth();
  
  // 1. Add state to track which card is currently "expanded"
  // null means no card is expanded.
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

  // 2. Helper function to toggle the expansion
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold text-[#4E3776] ">My Itineraries</h1>
        <button
          onClick={onCreateNew}
          className="bg-[#947DC4] text-white px-4 py-2 rounded hover:bg-[#3b2a59] transition-colors font-mono"
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
        // Changed to grid-cols-1 because expanded cards usually look better in a single column
        // but kept the responsive settings so it still works on large screens.
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary._id}
              className={`bg-white border rounded-xl p-5 shadow-sm transition-all duration-300 ${
                expandedId === itinerary._id ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200 hover:shadow-md'
              }`}
            >
              {/* Card Header: Clickable area to expand */}
              <div 
                className="cursor-pointer" 
                onClick={() => toggleExpand(itinerary._id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-[#4E3776]">
                      {itinerary.title}
                    </h2>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <p><span className="font-medium">Starts:</span> {formatDate(itinerary.startDate)}</p>
                      <p><span className="font-medium">Ends:</span> {formatDate(itinerary.endDate)}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xl">
                    {expandedId === itinerary._id ? '−' : '+'}
                  </span>
                </div>
              </div>

              {/* 3. The Expandable Detail Section */}
              {expandedId === itinerary._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                  <div className="bg-blue-50 rounded-lg p-4 bg-[#F2EFF8]">
                    <p className="text-[#947DC4] text-sm font-semibold italic">
                      📍 No destinations have been added to this itinerary yet. 
                      Explore our travel guides to start planning your stops!
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the card from toggling when clicking Edit
                    onEdit(itinerary);
                  }}
                  className="flex-1 text-sm font-semibold bg-[#B6A8D8]/50 px-3 py-2 rounded-lg font-itinerary"
                >
                  Edit Settings
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the card from toggling when clicking Delete
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