import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav
      className="text-white p-4"
      style={{ backgroundColor: '#B6A8D8' }}
    >
      {/* logo + hamburger button */}
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold font-title">
          TravelGo
        </Link>

        {/* Hamburger button shows on mobile */}
        <button
          className="sm:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>

        {/* Desktop links: hidden on mobile, visible on sm and above */}
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/itineraries" className="font-itinerary hover:underline">Itinerary</Link>
              <Link to="/profile" className="font-itinerary hover:underline">Profile</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded hover:bg-[#B92828] text-white font-itinerary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-itinerary hover:underline">Login</Link>
              <Link
                to="/register"
                className="bg-[#947DC4] text-white px-4 py-2 rounded hover:bg-[#3b2a59] transition-colors font-itinerary"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown only shows when hamburger is clicked */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 mt-4 pb-2">
          {user ? (
            <>
              <Link
                to="/itineraries"
                className="font-itinerary hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Itinerary
              </Link>
              <Link
                to="/profile"
                className="font-itinerary hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 rounded hover:bg-[#B92828] text-white font-itinerary transition-colors w-fit"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-itinerary hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#947DC4] text-white px-4 py-2 rounded hover:bg-[#3b2a59] transition-colors font-itinerary w-fit"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;