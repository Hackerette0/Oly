import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="p-10 min-h-screen bg-[#fdfcfb]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="font-serif-aesthetic italic text-5xl text-slate-900 mb-2">My Wishlist</h1>
          <p className="text-slate-500 font-sans-aesthetic uppercase tracking-[0.2em] text-[10px]">Curating your aesthetic favorites</p>
        </header>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product._id} className="relative group">
                <button 
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 z-20 p-2  /90 rounded-full shadow-md"
                >
                  <Heart size={18} className="fill-[#F11A00] text-[#F11A00]" />
                </button>

                <Link to={`/product/${product._id}`}>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
                    <img 
                      src={product.image ? `${backendUrl}${product.image}` : 'https://placehold.co/300x300'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={product.name}
                    />
                  </div>
                  <h3 className="font-sans-aesthetic text-[12px] font-bold uppercase tracking-widest text-slate-800">{product.name}</h3>
                  <p className="text-[#F11A00] font-bold">₹{product.price}</p>
                </Link>
                
                <button className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                  <ShoppingBag size={14} /> Add to Bag
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <Heart size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-sans-aesthetic">Your wishlist is currently empty.</p>
            <Link to="/" className="inline-block mt-6 text-[#F11A00] font-bold text-sm uppercase tracking-widest border-b-2 border-[#F11A00]">Start Exploring</Link>
          </div>
        )}
      </div>
    </div>
  );
}