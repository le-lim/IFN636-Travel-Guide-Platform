import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ItineraryForm = ({ itineraries, setItineraries, editingItinerary, onClose }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (editingItinerary) {
      setTitle(editingItinerary.title);
      setStartDate(editingItinerary.startDate.slice(0, 10));
      setEndDate(editingItinerary.endDate.slice(0, 10));
    } else {
      setTitle('');
      setStartDate('');
      setEndDate('');
    }
  }, [editingItinerary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItinerary) {
        const response = await axiosInstance.put(
          `/api/itineraries/${editingItinerary._id}`,
          { title, startDate, endDate },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setItineraries((prev) =>
          prev.map((item) =>
            item._id === editingItinerary._id ? response.data : item
          )
        );
      } else {
        const response = await axiosInstance.post(
          '/api/itineraries',
          { title, startDate, endDate },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setItineraries((prev) => [response.data, ...prev]);
      }
      onClose();
    } catch (error) {
      alert('Failed to save itinerary.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-0"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-5 sm:p-8 w-full max-w-md shadow-xl"
        style={{ border: '1px solid #4E3776', boxShadow: '0 4px 4px rgba(0,0,0,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-lg sm:text-xl font-bold mb-5 sm:mb-6"
          style={{ color: '#4E3776' }}
        >
          {editingItinerary ? 'Edit Itinerary' : 'Create New Itinerary'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title field */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: '#4E3776' }}
            >
              Itinerary Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Europe Summer Trip"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{ backgroundColor: '#F2EFF8' }}
            />
          </div>

          {/* Start date field */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: '#4E3776' }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{ backgroundColor: '#F2EFF8' }}
            />
          </div>

          {/* End date field */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: '#4E3776' }}
            >
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{ backgroundColor: '#F2EFF8' }}
            />
          </div>

          {/* Button row */}
          <div className="flex gap-3 mt-2 font-itinerary">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg transition text-sm"
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
              className="flex-1 px-4 py-2 rounded-lg transition text-sm font-medium font-itinerary"
              style={{
                backgroundColor: '#4E3776',
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