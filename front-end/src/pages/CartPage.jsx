import React from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  // Data keranjang dummy, nanti akan diganti dengan data asli
  const cartItems = []; 

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Keranjang Belanja Anda</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-10 px-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Keranjang Anda kosong.</h2>
          <p className="text-gray-500 mt-2 mb-6">Ayo tambahkan beberapa produk!</p>
          <Link 
            to="/" 
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Kembali ke Homepage
          </Link>
        </div>
      ) : (
        <div>
          {/* Nanti daftar produk di keranjang akan ditampilkan di sini */}
        </div>
      )}
    </div>
  );
};

export default CartPage;