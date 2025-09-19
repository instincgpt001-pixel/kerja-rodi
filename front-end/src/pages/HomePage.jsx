import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Pastikan API back-end Anda menyediakan endpoint ini
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Gagal memuat produk:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Hero Section */}
      <div className="text-center py-10 md:py-16 bg-gray-100 rounded-lg mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Selamat Datang di CampusMart!
        </h1>
        <p className="text-lg text-gray-600">
          Semua kebutuhanmu ada di sini, langsung dari tangan pertama.
        </p>
      </div>

      {/* Product List */}
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Produk Kami</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;