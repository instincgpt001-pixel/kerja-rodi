import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Komponen untuk Loading & Error
const LoadingSpinner = () => <div className="text-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;
const ErrorMessage = ({ message }) => <div className="text-center py-10 px-6 bg-red-100 text-red-700 rounded-lg"><p>{message}</p></div>;

const CartPage = () => {
  const [cart, setCart] = useState(null); // Menyimpan objek cart lengkap
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk Modal Checkout
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [addressText, setAddressText] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const navigate = useNavigate();

  // Muat data keranjang dari API (/api/cart)
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/cart', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Gagal mengambil data keranjang.');
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update jumlah item
  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`http://localhost:8000/api/cart/items/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ qty: newQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Gagal memperbarui jumlah.');

      // data diasumsikan item yang diupdate
      const updatedItem = data;
      setCart(currentCart => currentCart ? {
        ...currentCart,
        items: currentCart.items.map(item => item.id === itemId ? updatedItem : item)
      } : currentCart);
      toast.success('Jumlah item diperbarui!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Hapus item dari keranjang
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item ini?")) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Gagal menghapus item.');

      setCart(currentCart => currentCart ? {
        ...currentCart,
        items: currentCart.items.filter(item => item.id !== itemId)
      } : currentCart);

      setSelectedItems(currentSelected => {
        const newSelected = new Set(currentSelected);
        newSelected.delete(itemId);
        return newSelected;
      });

      toast.success('Item berhasil dihapus.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Pilih / batal pilih item
  const handleSelectItem = (itemId) => {
    setSelectedItems(currentSelected => {
      const newSelected = new Set(currentSelected);
      if (newSelected.has(itemId)) newSelected.delete(itemId);
      else newSelected.add(itemId);
      return newSelected;
    });
  };

  // Hitung total harga item terpilih
  const totalHarga = useMemo(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      if (selectedItems.has(item.id)) return total + (item.product.price * item.qty);
      return total;
    }, 0);
  }, [cart, selectedItems]);

  // Proses checkout
  const handleConfirmCheckout = async () => {
    if (addressText.trim() === '') {
      toast.error("Alamat pengiriman tidak boleh kosong.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await fetch('http://localhost:8000/api/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          address_text: addressText,
          item_ids: Array.from(selectedItems),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Gagal membuat pesanan.');

      toast.success('Pesanan berhasil dibuat!');
      setCheckoutModalOpen(false);
      setSelectedItems(new Set());
      await fetchCart(); // refresh keranjang
      navigate('/orders');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container mx-auto p-8"><ErrorMessage message={error} /></div>;

  const cartItems = cart?.items || [];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Keranjang Belanja</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">Keranjang Anda kosong</h2>
            <p className="text-gray-500 mt-2">Ayo mulai belanja dan temukan barang favoritmu!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded mr-4"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                  <img src={`http://localhost:8000/images/products/${item.product.image}`} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-grow mx-4">
                    <p className="font-semibold text-lg text-gray-800">{item.product.name}</p>
                    <p className="text-gray-600 font-bold">Rp {Number(item.product.price).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleUpdateQuantity(item.id, item.qty - 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!Number.isNaN(val)) handleUpdateQuantity(item.id, val);
                      }}
                      className="w-12 text-center border rounded"
                    />
                    <button onClick={() => handleUpdateQuantity(item.id, item.qty + 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0 w-32">
                    <p className="text-gray-500 text-sm">Subtotal</p>
                    <p className="font-bold text-lg text-gray-800">Rp {Number(item.product.price * item.qty).toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => handleDeleteItem(item.id)} className="ml-4 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                <h2 className="text-xl font-bold border-b pb-4 mb-4">Ringkasan Belanja</h2>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total Harga ({selectedItems.size} item)</span>
                  <span className="font-bold text-2xl text-gray-800">Rp {totalHarga.toLocaleString('id-ID')}</span>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  disabled={selectedItems.size === 0}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Konfirmasi Pesanan</h2>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Alamat Pengiriman</label>
              <textarea
                id="address"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan alamat lengkap Anda..."
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batalkan
              </button>
              <button
                onClick={handleConfirmCheckout}
                disabled={isCheckingOut}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isCheckingOut ? 'Memproses...' : 'Konfirmasi Pesanan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;