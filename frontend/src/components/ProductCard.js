// components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ProductCard = ({ product }) => {
  const handleAddToCart = async (e) => {
    e.preventDefault();           // ← prevents navigation from the Link
    e.stopPropagation();          // ← extra safety

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      return;
    }

    try {
      const response = await api.post('/cart/add', {
        product: product._id || product.id,   // use whichever field your backend expects
        quantity: 1,
      });

      console.log('Added to cart:', response.data);
      alert('Added to cart! ✓');   // ← replace with toast later

      // Optional: update global cart count here (context, redux, zustand...)
    } catch (err) {
      console.error('Add to cart error:', err);
      if (err.response?.status === 401) {
        alert('Authentication required. Please log in again.');
        // Optional: redirect to login
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    }
  };

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      <Link to={`/product/${product._id}`} className="group block">
  <div className="relative aspect-square   rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition">
  <img
    src={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}${product.image}`}
    alt={product.name}
    onError={(e) => {
      e.target.src = 'https://placehold.co/300?text=Image+Failed';
      console.error('Failed image URL:', e.target.src);
    }}
  />    
  {/* The favorite button stays – the badge is gone */}
    <button className="absolute top-3 right-3 p-2  /80 rounded-full hover:  transition">
      <span className="material-symbols-outlined text-gray-600">favorite</span>
    </button>
  </div>
  <h4 className="mt-3 text-sm font-semibold line-clamp-2">{product.name}</h4>
  <p className="text-xs text-gray-500">{product.category || 'Beauty'}</p>
  <p className="mt-1 text-base font-bold text-[#F11A00]">₹{product.price}</p>
</Link>

      {/* Add to Cart button – positioned over the card */}
      <button
        onClick={handleAddToCart}
        className="add-to-cart-btn"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          background: '#FF1493',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(255,20,147,0.3)',
          zIndex: 2,
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;