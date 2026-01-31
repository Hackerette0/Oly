// src/App.js
import './index.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import Header from './components/Header.js';
import Footer from './components/footer';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ProductDetail from './pages/ProductDetail.js';
import Cart from './pages/Cart.js';
import AIChatbot from './components/AIChatbot';
import ColorAnalysis from './pages/ColorAnalysis';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CommunityForum from './pages/CommunityForum'; 
import Navbar from './components/Navbar';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import SkinDiary from './components/SkinDiary.js'
import FeaturedProduct from './pages/FeaturedProduct.js';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {

  return (
     
    <div className="dark bg-gray-950 text-gray-100 min-h-screen">
    <Router>
      <Navbar/>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <main style={{ padding: '20px', flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/featured-product" element={<FeaturedProduct />} />
            <Route path="/category/:categoryName" element={<Home />} />
            <Route path="/community" element={<CommunityForum />} />
            <Route path="/color-analysis" element={<ColorAnalysis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/skin-diary" element={<SkinDiary />} />

            {/* Admin route – protected */}
            <Route path="/skin-diary" element={
              <ProtectedRoute>
                <SkinDiary />
              </ProtectedRoute>
            }/>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <h2>Page not found ✨</h2>
                  <p>Try going back to <a href="/">Home</a></p>
                </div>
              }
            />
          </Routes>
        </main>

        <AIChatbot />
        <Footer />
      </div>
    </Router>
    </div>
  );
  
}

export default App;
