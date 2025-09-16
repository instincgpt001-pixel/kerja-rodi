import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import "./App.css";


function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]); // State untuk menyimpan produk
  const [showRegister, setShowRegister] = useState(false);


  useEffect(() => {
    // Fungsi untuk mengambil data produk dari API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      }
    };


    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
          headers: {
            "Accept": "application/json",
          },
        });


        if (response.ok) {
          const data = await response.json();
          setUser(data);
          fetchProducts(); // Panggil fetchProducts setelah login berhasil
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Gagal memeriksa status login:", err);
        setUser(null);
      }
    };


    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      }
    };

    if (user) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [user]);


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });
      setUser(null);
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };


  if (!user) {
    return showRegister ? (
      <RegisterForm onRegister={setUser} switchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onLogin={setUser} switchToRegister={() => setShowRegister(true)} />
    );
  }


  return (
    <>
      <h1>Selamat datang, {user.name} 👋</h1>
      <button onClick={handleLogout}>Logout</button>


      <h2>Daftar Produk</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {/* Sesuaikan path gambar */}
            <img
              src={`http://localhost:8000/images/products/${product.image}`}
              alt={product.name}
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
            <h3>{product.name}</h3>
            <p>Rp {product.price}</p>
            <p>Stok: {product.stock}</p>
          </div>
        ))}
      </div>
    </>
  );
}


export default App;
