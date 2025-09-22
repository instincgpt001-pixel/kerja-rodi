import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          CampusMart
        </Link>
        <div className="space-x-4">
          <Link to="/cart" className="text-gray-300 hover:text-white mr-4">Keranjang</Link>
          <Link to="/register" className="text-gray-300 hover:text-white">Daftar</Link>
          <span className="text-gray-500">|</span>
          <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;