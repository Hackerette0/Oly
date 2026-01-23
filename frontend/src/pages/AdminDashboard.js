// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', skinType: 'all', stock: '', image: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const AdminDashboard = () => {
  const [message, setMessage] = useState('Loading admin dashboard...');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Optional: call a protected admin endpoint to verify role
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.data.isAdmin && res.data.role !== 'admin') {
          setMessage('Access denied: You are not an admin.');
          return;
        }

        setMessage('Welcome to Admin Dashboard! (Products & Orders management coming soon)');
      } catch (err) {
        setMessage('Error verifying admin access. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#e91e63' }}>Admin Dashboard</h1>
      <p style={{ fontSize: '20px', margin: '30px 0' }}>{message}</p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          background: '#e91e63',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Back to Home
      </button>
    </div>
  );
};
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/orders/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProducts(prodRes.data);
        setOrders(orderRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load admin data. Make sure you are admin.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product created!');
      setNewProduct({ name: '', description: '', price: '', category: '', skinType: 'all', stock: '', image: '' });
      // Refresh products
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      alert('Error creating product: ' + (err.response?.data?.msg || err.message));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh orders
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div style={{ color: 'red', padding: '40px' }}>{error}</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: '#e91e63' }}>Admin Dashboard</h1>

      {/* Create Product Form */}
      <section style={{ marginBottom: '60px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2>Create New Product</h2>
        <form onSubmit={handleCreateProduct} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
          <input name="name" placeholder="Product Name *" value={newProduct.name} onChange={handleInputChange} required />
          <input name="price" type="number" placeholder="Price *" value={newProduct.price} onChange={handleInputChange} required />
          <input name="category" placeholder="Category (skincare, makeup, etc.) *" value={newProduct.category} onChange={handleInputChange} required />
          <select name="skinType" value={newProduct.skinType} onChange={handleInputChange}>
            <option value="all">All</option>
            <option value="oily">Oily</option>
            <option value="dry">Dry</option>
            <option value="combination">Combination</option>
            {/* add more */}
          </select>
          <input name="stock" type="number" placeholder="Stock *" value={newProduct.stock} onChange={handleInputChange} required />
          <input name="image" placeholder="Image URL (temporary)" value={newProduct.image} onChange={handleInputChange} style={{ gridColumn: '1 / -1' }} />
          <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} style={{ gridColumn: '1 / -1', height: '100px' }} />
          <button type="submit" style={{ gridColumn: '1 / -1', padding: '14px', background: '#e91e63', color: 'white', border: 'none', borderRadius: '8px' }}>
            Add Product
          </button>
        </form>
      </section>

      {/* Products List */}
      <section style={{ marginBottom: '60px' }}>
        <h2>All Products ({products.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {products.map(p => (
            <div key={p._id} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
              <img 
                src={`${process.env.REACT_APP_API_URL}${p.image?.startsWith('/') ? '' : '/'}${p.image || ''}`} 
                alt={p.name} 
                style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '16px' }}>
                <h4>{p.name}</h4>
                <p>₹{p.price} • {p.category} • Stock: {p.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Orders List */}
      <section>
        <h2>All Orders ({orders.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f8f8' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{o._id.slice(-6)}</td>
                  <td style={{ padding: '12px' }}>{o.user?.username || 'Unknown'}</td>
                  <td style={{ padding: '12px' }}>₹{o.totalAmount}</td>
                  <td style={{ padding: '12px' }}>
                    <select 
                      value={o.status} 
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button style={{ background: '#e91e63', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;