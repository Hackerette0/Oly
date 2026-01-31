import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import { NavLink, useNavigate, Link } from 'react-router-dom'; // Added Link
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  User, 
  LogOut, 
  Search, 
  ShoppingCart, 
  Users, 
  Sparkles, 
  Menu, 
  X,
  ChevronRight 
} from 'lucide-react'; // Added all missing icons

export default function Navbar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Sync login state
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    setSidebarOpen(false);
  };

  const categories = [
  { name: "Skincare", slug: "skincare" },
  { name: "Haircare", slug: "haircare" },
  { name: "Oral Care", slug: "oral-care" },
  { name: "Personal Hygiene & Body Care", slug: "personal-hygiene-body-care" },
  { name: "Grooming & Specialized Care", slug: "grooming-specialized-care" },
  { name: "Wellness & Self-Care", slug: "wellness-self-care" }
];

  const sidebarLinkStyle = ({ isActive }) => 
    `flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      isActive ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <>
      {/* --- TOP HEADER --- */}
      <nav className="w-full border-b border-slate-100 sticky top-0 z-40 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-8">
          
          {/* Menu Toggle & Logo */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-full">
              <Menu size={24} className="text-slate-700" />
            </button>
            <Link to="/" className="text-4xl font-serif-aesthetic font-bold text-[#F11A00] italic tracking-tight">ōly</Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search beauty, brands..." 
              className="w-full bg-slate-50 border-none rounded-full py-2 px-10 focus:ring-2 focus:ring-rose-200 outline-none text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-2 md:gap-6">
            <NavLink title="Home" to="/" className={({isActive}) => isActive ? 'text-rose-600' : 'text-slate-500'}><Home size={20}/></NavLink>
            <NavLink title="Orders" to="/orders" className={({isActive}) => isActive ? 'text-rose-600' : 'text-slate-500'}><ShoppingBag size={20}/></NavLink>
            <NavLink title="Wishlist" to="/wishlist" className={({isActive}) => isActive ? 'text-rose-600' : 'text-slate-500'}><Heart size={20}/></NavLink>
            <NavLink title="Profile" to="/profile" className={({isActive}) => isActive ? 'text-rose-600' : 'text-slate-500'}><User size={20}/></NavLink>
            
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-slate-400 hover:text-rose-600 ml-2"><LogOut size={20}/></button>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR DRAWER --- */}
      <aside className={`fixed top-0 left-0 h-full w-80 z-[60] shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-8">
            <span className="font-serif-aesthetic text-2xl font-bold">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Categories */}
            <div className="mb-8">
  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-4 font-sans-aesthetic">Categories</p>
  {categories.map(cat => (
  <Link 
    key={cat.slug} 
    to={`/category/${cat.slug}`} // Uses the clean slug directly
    onClick={() => setSidebarOpen(false)}
    className="flex items-center justify-between px-4 py-3 hover:bg-rose-50 rounded-xl group"
  >
    <span className="text-slate-700 font-sans-aesthetic text-sm group-hover:text-[#F11A00]">
      {cat.name}
    </span>
    <ChevronRight size={14} />
  </Link>
))}
</div>

            {/* Tools & Community */}
            <div className="mb-8 border-t border-slate-50 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">Experience</p>
              <NavLink to="/community" className={sidebarLinkStyle}>
                <div className="flex items-center gap-3"><Users size={18}/> Community</div>
              </NavLink>
              <NavLink to="/color-analysis" className={sidebarLinkStyle}>
                <div className="flex items-center gap-3 text-purple-600"><Sparkles size={18}/> Personal Colors</div>
              </NavLink>
              <NavLink to="/cart" className={sidebarLinkStyle}>
                <div className="flex items-center gap-3"><ShoppingCart size={18}/> Cart</div>
              </NavLink>
            </div>
          </div>

          {/* Logout at bottom */}
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-4 py-4 text-rose-600 font-bold border-t border-slate-50 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut size={18}/> Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}