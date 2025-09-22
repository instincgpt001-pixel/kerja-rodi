import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import komponen dan halaman
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow"> 
          <Routes>
            {/* Rute Utama */}
            <Route path="/" element={<HomePage />} />
            
            {/* Rute Otentikasi */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rute Keranjang */}
            <Route path="/cart" element={<CartPage />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
