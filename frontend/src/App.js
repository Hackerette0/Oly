// src/App.js
import './index.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.js';
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

// Protected route wrapper (simple version for now)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin-only route wrapper (you can make this stricter later)
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // For now: allow any logged-in user to access /admin
  // Later: fetch user and check isAdmin / role === 'admin'
  return children;
};

function App() {
  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main style={{ padding: '20px', flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<CommunityForum />} />
            <Route path="/color-analysis" element={<ColorAnalysis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin route – protected */}
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
                  <h2>404 – Page Not Found</h2>
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
  );
}

export default App;