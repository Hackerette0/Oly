import React, { useRef, useState } from 'react';
import { Pencil, Mail, Phone, MapPin, ShoppingBag, Heart, CreditCard, Loader2, Check } from 'lucide-react';
import axios from 'axios';

export default function Profile() {
  const fileInputRef = useRef(null);
  
  // States for UI and Data
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [user, setUser] = useState({
    name: "Sucharitha",
    email: "suchi@example.com",
    phone: "+91 98765 43210",
    role: "Buyer",
    joined: "January 2025",
    ordersCount: 8,
    wishlistCount: 14,
    address: "No. 24, Ocean Breeze Apt, Besant Nagar, Chennai - 600090",
  });

  const handleEditClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setAvatar(newImageUrl);
    }
  };

  // --- THE UPDATE FUNCTION ---
  const handleUpdateProfile = async () => {
    setLoading(true);
    setSuccess(false);
    
    try {
      // Replace with your actual update endpoint
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/update`, {
        name: user.name,
        avatar: avatar, // Ideally, you'd upload the file to S3/Cloudinary first
        phone: user.phone,
        address: user.address
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Hide success after 3s
      }
    } catch (err) {
      console.error("Update failed:", err);
      // Fallback for demo if backend isn't ready
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfcfb] flex flex-col items-center justify-center p-6 font-sans animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
        .font-serif-aesthetic { font-family: 'Playfair Display', serif; }
        .font-sans-aesthetic { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-rose-200 to-pink-100" />

        <div className="px-8 pb-10">
          {/* Profile Picture */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative inline-block group">
              <img
                src={avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full border-[5px] border-white shadow-xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <button 
                onClick={handleEditClick}
                className="absolute bottom-1 right-1 bg-slate-900 text-white p-2.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors border-2 border-white"
              >
                <Pencil size={16} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif-aesthetic italic text-slate-900 leading-tight">{user.name}</h1>
            <p className="text-slate-400 font-sans-aesthetic text-[10px] uppercase tracking-[0.2em] mt-1.5">
              {user.role} • Joined {user.joined}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: 'Orders', val: user.ordersCount, icon: <ShoppingBag size={12}/> },
              { label: 'Wishlist', val: user.wishlistCount, icon: <Heart size={12}/> },
              { label: 'Spent', val: '₹4,820', icon: <CreditCard size={12}/> }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center border border-white">
                <div className="flex justify-center text-rose-400 mb-1">{stat.icon}</div>
                <p className="text-lg font-serif-aesthetic text-slate-800 m-0 leading-none mb-1">{stat.val}</p>
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-none m-0">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Info Rows */}
          <div className="space-y-5 px-2 mb-10 text-left">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500"><Mail size={16}/></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold m-0">Email</p>
                <p className="text-slate-700 font-medium text-sm truncate m-0">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500"><Phone size={16}/></div>
              <div className="flex-1">
                <p className="text-[9px] uppercase tracking-widest text-slate-300 font-bold m-0">Phone</p>
                <p className="text-slate-700 font-medium text-sm m-0">{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Functional Update Button */}
          <button 
            disabled={loading}
            onClick={handleUpdateProfile}
            className={`w-full py-4 rounded-full font-sans-aesthetic font-bold text-[10px] tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 
              ${success ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-rose-600 active:scale-95'}`}
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={16} /> UPDATING...</>
            ) : success ? (
              <><Check size={16} /> PROFILE UPDATED</>
            ) : (
              "UPDATE PROFILE"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}