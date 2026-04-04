import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ItineraryList from '../components/ItineraryList';
import ItineraryForm from '../components/ItineraryForm';
import { useAuth } from '../context/AuthContext';

const Itineraries = () => {
  const { user } = useAuth();

  const [itineraries, setItineraries] = useState([]);       
  const [editingItinerary, setEditingItinerary] = useState(null);  
  const [showForm, setShowForm] = useState(false);          


  // useEffect() runs code when the page first loads (or when something changes).
  // The [] at the end means "only run once when the page loads" — not repeatedly.

  // Fetches all itineraries from your backend and stores them in state
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axiosInstance.get('/api/itineraries', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItineraries(response.data);
      } catch (error) {
        alert('Failed to fetch itineraries.');
      }
    };
    fetchItineraries();
  }, [user]);

  // Called when user clicks "Create New" button
  const handleCreateNew = () => {
    setEditingItinerary(null);
    setShowForm(true);         
  };

  // Called when user clicks "Edit" on a card, pass itinerary data to form and open modal
  const handleEdit = (itinerary) => {
    setEditingItinerary(itinerary);
    setShowForm(true);              
  };

  // Called when the form is closed or submitted (closes the modal)
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItinerary(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ItineraryList
        itineraries={itineraries}
        setItineraries={setItineraries}
        onEdit={handleEdit}
        onCreateNew={handleCreateNew}
      />

      {showForm && (
        <ItineraryForm
          itineraries={itineraries}
          setItineraries={setItineraries}
          editingItinerary={editingItinerary}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Itineraries;