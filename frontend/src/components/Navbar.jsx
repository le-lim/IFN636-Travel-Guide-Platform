import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center"
          style={{ backgroundColor: '#B6A8D8' }}>
      <Link to="/" className="text-xl font-bold font-title ">  TravelGo</Link>
      
      <div>
        {user ? (
          <>
            <Link to="/itineraries" className="mr-4 font-itinerary">Itinerary</Link>
            <Link to="/profile" className="mr-4 font-itinerary">Profile</Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded hover:bg-[#B92828] text-white font-itinerary transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 font-itinerary">Login</Link>
            <Link
              to="/register"
              className="bg-[#947DC4] text-white px-4 py-2 rounded hover:bg-[#3b2a59] transition-colors font-itinerary"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
