import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import cartIcon from "../assets/icons/cart.svg";
import userIcon from "../assets/icons/user.svg";
import WebLogo from '../assets/icon-web-shopping.svg';

const Navbar = () => {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const logoLinkDestination = user && user.role === 'admin' ? '/admin' : '/';

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto px-3 py-1">
        <div className="flex justify-between items-center">
          {/* Brand Name */}
          <Link to={logoLinkDestination} className="flex items-center">
            <img src={WebLogo} alt="CampusMart Logo" className="h-10 w-auto mr-1 filter invert" />
            <span className="text-2xl font-bold text-white">
              CampusMart
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            
            {/* Perubahan di sini: Tampilkan jika BUKAN admin (atau jika belum login) */}
            {(!user || user.role !== 'admin') && (
              <>
                <Link to="/orders" className="text-white hover:text-blue-200 transition">
                  Pesanan Saya
                </Link>

                <Link to="/cart" className="relative p-2 hover:bg-blue-200 rounded-full transition group">
                  <img
                    src={cartIcon}
                    alt="Cart"
                    className="h-6 w-6 filter brightness-0 invert group-hover:invert-0 group-hover:brightness-100"
                  />
                  {user && cartCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 min-w-[1.25rem] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img src={userIcon} alt="User Profile" className="w-8 h-8 filter brightness-0 invert" />
                  <span className="ml-2 text-white hidden md:block">Hi, {user.name}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-20">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-gray-800 font-semibold rounded-md hover:bg-blue-100 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;