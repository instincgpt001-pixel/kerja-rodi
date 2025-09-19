import React from 'react';

const ProductCard = ({ product }) => {
  const imageUrl = `http://localhost:8000/public/images/products/${product.image}`;

  return (
    <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img 
        src={imageUrl} 
        alt={product.name} 
        className="w-full h-48 object-cover mb-4 rounded-md" 
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-700 mb-1">Rp {Number(product.price).toLocaleString('id-ID')}</p>
      <p className="text-sm text-gray-500 mb-4">Stok: {product.stock}</p>
      <button className="w-full mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
        Tambah ke Keranjang
      </button>
    </div>
  );
};

export default ProductCard;