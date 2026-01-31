// src/components/Profile.jsx
import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, Mail, Phone, ShoppingBag, Heart, CreditCard, Loader2, Check, MapPin 
} from 'lucide-react';
import api from '../libs/axios.js';  

export default function Profile() {
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Buyer',
    joined: '',
    ordersCount: 0,
    wishlistCount: 0,
    address: '',
  });

  // Fetch authenticated user's profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setFetching(true);
        setError(null);

        const response = await api.get('/auth/me');  

        const userData = response.data;

        setUser({
          name: userData.username || '', 
          email: userData.email || 'No email provided',
          phone: userData.phone || '',
          role: userData.role || 'Buyer',
          joined: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown',
          ordersCount: userData.ordersCount || 0,
          wishlistCount: userData.wishlistCount || 0,
          address: userData.address || '',
        });

        if (userData.avatar) {
          setAvatar(userData.avatar);
        }

      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(
          err.response?.status === 401 
            ? "Session expired. Please log in again."
            : "Failed to load profile. Please try again later."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // For preview only – in production, upload to backend and get URL
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
      // TODO: In real app → upload file here and update user.avatar with returned URL
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!user.name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const updatePayload = {
        name: user.name.trim(),
        phone: user.phone.trim(),
        address: user.address.trim(),
      };

      await api.put('/api/auth/update', updatePayload);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(
        err.response?.data?.message || 
        "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  //                  RENDERING
  // ────────────────────────────────────────────────

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb]">
        <Loader2 className="animate-spin text-rose-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] p-6">
        <div className="  p-8 rounded-2xl shadow-lg text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <a 
            href="/login" 
            className="text-rose-600 hover:underline font-medium"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fdfcfb] flex flex-col items-center justify-center p-6 font-sans animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');
        .font-serif-aesthetic { font-family: 'Playfair Display', serif; }
        .font-sans-aesthetic { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="w-full max-w-md   rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-rose-200 to-pink-100" />

        <div className="px-8 pb-10">
          {/* Avatar */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative inline-block group">
              <img
                src={avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full border-[5px] border-white shadow-xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <button
                onClick={handleEditAvatarClick}
                className="absolute bottom-1 right-1 bg-slate-900 text-white p-2.5 rounded-full shadow-lg hover:bg-rose-600 transition-colors border-2 border-white"
                type="button"
              >
                <Pencil size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center mb-8">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="text-3xl font-serif-aesthetic italic text-slate-900 leading-tight bg-transparent border-b border-rose-300 focus:outline-none focus:border-rose-500 text-center w-full max-w-xs mx-auto block"
              placeholder="Your name"
            />
            <p className="text-slate-400 font-sans-aesthetic text-[10px] uppercase tracking-[0.2em] mt-1.5">
              {user.role} • Joined {user.joined}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: 'Orders', val: user.ordersCount, icon: <ShoppingBag size={12} /> },
              { label: 'Wishlist', val: user.wishlistCount, icon: <Heart size={12} /> },
              { label: 'Spent', val: '₹4,820', icon: <CreditCard size={12} /> }, // ← can fetch real value later
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center border border-white">
                <div className="flex justify-center text-rose-400 mb-1">{stat.icon}</div>
                <p className="text-lg font-serif-aesthetic text-slate-800 m-0 leading-none mb-1">
                  {stat.val}
                </p>
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-none m-0">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Editable Fields */}
          <div className="space-y-6 px-2 mb-10 text-left">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 mt-1">
                <Mail size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold m-0">Email</p>
                <p className="text-slate-500 font-medium text-sm truncate m-0">
                  {user.email}  {/* Email usually not editable */}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                <Phone size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold m-0">Phone</p>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className="text-slate-700 font-medium text-sm bg-transparent border-b border-slate-300 focus:outline-none focus:border-rose-500 w-full"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 mt-1">
                <MapPin size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold m-0">Address</p>
                <textarea
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="text-slate-700 font-medium text-sm bg-transparent border-b border-slate-300 focus:outline-none focus:border-rose-500 w-full resize-none"
                  placeholder="Your delivery address"
                />
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button
            disabled={loading}
            onClick={handleUpdateProfile}
            className={`w-full py-4 rounded-full font-sans-aesthetic font-bold text-[10px] tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 
              ${success 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-slate-900 hover:bg-rose-600 text-white active:scale-95'}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                UPDATING...
              </>
            ) : success ? (
              <>
                <Check size={16} />
                PROFILE UPDATED
              </>
            ) : (
              "UPDATE PROFILE"
            )}
          </button>

          {error && (
            <p className="text-red-600 text-center text-sm mt-4">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}