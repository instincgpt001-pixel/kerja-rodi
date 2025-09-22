import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Komponen untuk menampilkan loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Komponen untuk menampilkan pesan error
const ErrorMessage = ({ message }) => (
  <div className="text-center py-10 px-6 bg-red-100 text-red-700 rounded-lg">
    <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
    <p>{message}</p>
    <Link to="/" className="mt-4 inline-block px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
      Kembali ke Homepage
    </Link>
  </div>
);

// Komponen untuk menampilkan pesan "Tidak Ditemukan"
const NotFoundMessage = () => (
  <div className="text-center py-10 px-6 bg-gray-100 rounded-lg">
    <h2 className="text-xl font-semibold text-gray-700">Produk tidak ditemukan</h2>
    <p className="text-gray-500 mt-2">Coba gunakan kata kunci atau kategori lain.</p>
  </div>
);

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(location.search);
      const query = params.get('q');
      const categoryId = params.get('category');

      let url = '';
      if (query) {
        setTitle(`Hasil Pencarian untuk: "${query}"`);
        url = `http://localhost:8000/api/products/search?q=${query}`;
      } else if (categoryId) {
        // Asumsi kita perlu nama kategori untuk judul, kita bisa fetch atau bawa dari state sebelumnya
        // Untuk simple, kita buat judul generik
        setTitle(`Produk dalam Kategori`);
        url = `http://localhost:8000/api/categories/${categoryId}/products`;
      } else {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Gagal memuat data produk.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{title}</h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      
      {!loading && !error && (
        products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <NotFoundMessage />
        )
      )}
    </div>
  );
};

export default ProductListPage;