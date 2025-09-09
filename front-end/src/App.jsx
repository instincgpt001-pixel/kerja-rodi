// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Siapkan "wadah" untuk menyimpan data produk
  const [products, setProducts] = useState([]);

  // 2. Gunakan useEffect untuk memanggil API saat komponen pertama kali dirender
  useEffect(() => {
    // Alamat API backend kita
    const apiUrl = 'http://localhost:8000/api/products';

    // 3. Panggil API menggunakan 'fetch'
    fetch(apiUrl)
      .then(response => response.json()) // Ubah response menjadi JSON
      .then(data => {
        console.log(data); // Cek data di console browser
        setProducts(data); // Masukkan data dari API ke dalam "wadah"
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Array kosong artinya useEffect hanya berjalan sekali

  return (
    <>
      <h1>Daftar Produk UMKM 🛍️</h1>
      <div className="product-list">
        {/* 4. Tampilkan data produk yang sudah didapat */}
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            <p>Rp {product.price.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;