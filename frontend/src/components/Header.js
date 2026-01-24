import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaUsers } from 'react-icons/fa'; // ← Added FaUsers

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 30px',
        background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#F11A00',
          textDecoration: 'none',
        }}
      >
        öly
      </Link>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px' }}>
        <input
          type="text"
          placeholder="Search for products, brands..."
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '50px',
            border: '1px solid #ddd',
            outline: 'none',
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        
        {/* Community Forum Link */}
        <NavLink
          to="/community"
          style={{
            color: '#333',
            textDecoration: 'none',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          className={({ isActive }) => (isActive ? 'text-rose-600' : '')}
        >
          <FaUsers style={{ fontSize: '20px' }} />
          <span>Community</span>
        </NavLink>

        <NavLink
          to="/color-analysis"
          style={{
            color: '#6b46c1',
            textDecoration: 'none',
            fontWeight: '500',
          }}
          className={({ isActive }) => (isActive ? 'text-purple-400' : '')}
        >
          Personal Colors
        </NavLink>

        <Link to="/cart" style={{ fontSize: '22px', color: '#333', display: 'flex', alignItems: 'center' }}>
          <FaShoppingCart />
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              title="My Profile"
              style={{ fontSize: '22px', color: '#333', display: 'flex', alignItems: 'center' }}
            >
              <FaUserCircle />
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#F11A00',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/login" style={{ color: '#333', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: '#F11A00', textDecoration: 'none' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;