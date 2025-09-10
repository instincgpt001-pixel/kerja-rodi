import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Siapkan "state" (wadah kosong) untuk menyimpan data produk
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahan: state untuk loading
  const [error, setError] = useState(null);     // Tambahan: state untuk error

  // 2. useEffect akan berjalan sekali saat komponen pertama kali tampil
  useEffect(() => {
    // Alamat API backend kita
    const apiUrl = 'http://localhost:8000/api/products';

    // 3. Panggil API menggunakan 'fetch'
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Ubah response menjadi JSON
      })
      .then(data => {
        console.log("Data berhasil diterima:", data); // Cek data di console browser
        setProducts(data); // Masukkan data dari API ke dalam state
        setLoading(false); // Hentikan loading
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message); // Simpan pesan error
        setLoading(false);     // Hentikan loading
      });
  }, []); // Array kosong `[]` memastikan ini hanya berjalan sekali

  // Tampilan kondisional berdasarkan state
  if (loading) {
    return <div>Memuat data produk...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1>Daftar Produk UMKM 🛍️</h1>
      <div className="product-list">
        {/* 4. Tampilkan data produk dari state */}
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            {/* Mengubah format harga menjadi Rupiah */}
            <p>Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
            <p>Stok: {product.stock}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;