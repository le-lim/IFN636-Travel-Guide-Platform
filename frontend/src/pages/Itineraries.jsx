import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ItineraryList from '../components/ItineraryList';
import ItineraryForm from '../components/ItineraryForm';
import { useAuth } from '../context/AuthContext';

// ─── WHAT IS THIS FILE? ────────────────────────────────────────────────────────
// This is the "brain" of your itinerary feature.
// It owns all the data and decides what to show.
// It passes data DOWN to ItineraryList and ItineraryForm as props.
// ──────────────────────────────────────────────────────────────────────────────

const Itineraries = () => {
  // useAuth() gives us the logged-in user's info (including their token)
  const { user } = useAuth();

  // useState() creates a variable that React watches.
  // When it changes, React automatically re-renders the screen.
  // [value, functionToChangeValue] = useState(startingValue)

  const [itineraries, setItineraries] = useState([]);       // the list of itineraries fetched from backend
  const [editingItinerary, setEditingItinerary] = useState(null);  // which itinerary is being edited (null = none)
  const [showForm, setShowForm] = useState(false);          // whether the modal popup is open or closed

  // useEffect() runs code when the page first loads (or when something changes).
  // The [] at the end means "only run once when the page loads" — not repeatedly.
  useEffect(() => {
    fetchItineraries();
  }, [user]);

  // Fetches all itineraries from your backend and stores them in state
  const fetchItineraries = async () => {
    try {
      const response = await axiosInstance.get('/api/itineraries', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItineraries(response.data); // update state → React re-renders the list
    } catch (error) {
      alert('Failed to fetch itineraries.');
    }
  };

  // Called when user clicks "Create New" button
  const handleCreateNew = () => {
    setEditingItinerary(null); // no itinerary selected = blank form
    setShowForm(true);         // open the modal
  };

  // Called when user clicks "Edit" on a card
  const handleEdit = (itinerary) => {
    setEditingItinerary(itinerary); // pass the itinerary data to the form
    setShowForm(true);              // open the modal
  };

  // Called when the form is closed or submitted — closes the modal
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItinerary(null);
  };

  return (
    <div className="container mx-auto p-6">
      <ItineraryList
        itineraries={itineraries}        // pass the list of itineraries to display
        setItineraries={setItineraries}  // pass the setter so List can update the list after delete
        onEdit={handleEdit}              // pass the edit handler so List can trigger the form
        onCreateNew={handleCreateNew}    // pass the create handler for the "Create New" button
      />

      {/* Only render the form modal if showForm is true */}
      {showForm && (
        <ItineraryForm
          itineraries={itineraries}
          setItineraries={setItineraries}
          editingItinerary={editingItinerary}  // null = create mode, has data = edit mode
          onClose={handleCloseForm}            // so the form can close itself
        />
      )}
    </div>
  );
};

export default Itineraries;