import React from 'react';
import { Link } from 'react-router-dom';
import cartIcon from '../assets/icons/cart.svg'; 
import webIcon from '../assets/icon-web-shopping.svg';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto px-3 py-1">
        <div className="flex justify-between items-center">
          {/* Brand Name */}
          <Link to="/" className="text-white text-2xl font-bold">
            CampusMart
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {/* --- (BARU) Link ke Riwayat Pesanan --- */}
            <Link to="/orders" className="text-white hover:text-blue-200 transition">
              Pesanan Saya
            </Link>
            
            <Link to="/cart" className="relative p-2 hover:bg-blue-200 rounded-full transition group">
              <img src={cartIcon} alt="Cart" className="h-6 w-6 filter brightness-0 invert group-hover:invert-0 group-hover:brightness-100" />
              {/* Nanti bisa ditambahkan state untuk jumlah item */}
              {/* <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs text-center">3</span> */}
            </Link>

            <Link to="/login" className="px-4 py-2 bg-white text-gray-800 font-semibold rounded-md hover:bg-blue-100 transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;