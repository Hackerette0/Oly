// src/pages/Cart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view your cart');
      setLoading(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const validCart = res.data.filter((item) => item?.product);
        setCart(validCart);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Cart fetch error:', err);
        setError(err.response?.data?.msg || 'Failed to load cart.');
        setLoading(false);
      });
  }, []);

  const total = cart.reduce((sum, item) => {
    const price = item?.product?.price ?? 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateAddress = () => {
    if (!address.fullName.trim()) return 'Full name is required';
    if (!address.phone.match(/^\d{10}$/)) return 'Enter valid 10-digit phone number';
    if (!address.addressLine1.trim()) return 'Address line 1 is required';
    if (!address.city.trim()) return 'City is required';
    if (!address.state.trim()) return 'State is required';
    if (!address.pincode.match(/^\d{6}$/)) return 'Enter valid 6-digit pincode';
    return '';
  };

  const handlePlaceOrder = async () => {
    const validationError = validateAddress();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders`,
        {
          items: cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity || 1,
          })),
          totalAmount: total,
          shippingAddress: address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Order placed successfully! Order ID: ' + response.data._id);
      // Optional: clear cart after success
      // await axios.delete(`${process.env.REACT_APP_API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/order-success'); // or wherever you want to redirect
    } catch (err) {
      console.error('Order error:', err);
      setFormError(err.response?.data?.msg || 'Failed to place order. Try again.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading your cart...</div>;
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Oops!</h2>
        <p>{error}</p>
        <Link to="/login" style={{ color: '#e91e63', fontWeight: 'bold' }}>
          Login to view cart
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Your bag is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          style={{
            marginTop: '20px',
            display: 'inline-block',
            padding: '12px 24px',
            background: '#e91e63',
            color: 'white',
            borderRadius: '30px',
            textDecoration: 'none',
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '40px', color: '#1a1a1a' }}>
        Your Bag ({cart.length} items)
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Cart Items */}
        <div>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '20px 0',
                borderBottom: '1px solid #eee',
                alignItems: 'center',
              }}
            >
              <img
                src={
                  item?.product?.image
                    ? `${process.env.REACT_APP_API_URL}${item.product.image.startsWith('/') ? '' : '/'}${item.product.image}`
                    : 'https://placehold.co/120x140?text=No+Image'
                }
                alt={item?.product?.name || 'Product'}
                style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: '8px' }}
                onError={(e) => (e.target.src = 'https://placehold.co/120x140?text=Image+Error')}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                  {item?.product?.name || 'Product Unavailable'}
                </h3>
                <p style={{ color: '#c8102e', fontWeight: '600' }}>
                  ₹{item?.product?.price ?? '—'}
                </p>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Quantity: {item.quantity || 1}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary + Address Form */}
        <div
          style={{
            background: '#f8f8f8',
            padding: '32px',
            borderRadius: '12px',
            height: 'fit-content',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Order Summary</h3>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Shipping</span>
              <span style={{ color: '#0c8300' }}>FREE</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '600',
                fontSize: '18px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #ddd',
              }}
            >
              <span>Total</span>
              <span style={{ color: '#c8102e' }}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {!showCheckoutForm ? (
            <button
              onClick={() => setShowCheckoutForm(true)}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                background: '#e91e63',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
              }}
            >
              Proceed to Checkout
            </button>
          ) : (
            <>
              <h3 style={{ fontSize: '20px', margin: '24px 0 16px' }}>Shipping Address</h3>

              {formError && (
                <p style={{ color: 'red', marginBottom: '16px' }}>{formError}</p>
              )}

              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  name="fullName"
                  placeholder="Full Name *"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  required
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <input
                  name="phone"
                  placeholder="Phone Number (10 digits) *"
                  value={address.phone}
                  onChange={handleAddressChange}
                  required
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <input
                  name="addressLine1"
                  placeholder="Address Line 1 *"
                  value={address.addressLine1}
                  onChange={handleAddressChange}
                  required
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <input
                  name="addressLine2"
                  placeholder="Address Line 2 (optional)"
                  value={address.addressLine2}
                  onChange={handleAddressChange}
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    name="city"
                    placeholder="City *"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                    style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                  <input
                    name="state"
                    placeholder="State *"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                    style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
                <input
                  name="pincode"
                  placeholder="Pincode *"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  required
                  style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </form>

              <button
                onClick={handlePlaceOrder}
                style={{
                  width: '100%',
                  padding: '16px',
                  marginTop: '24px',
                  fontSize: '18px',
                  background: '#e91e63',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                }}
              >
                Place Order
              </button>

              <button
                onClick={() => setShowCheckoutForm(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '12px',
                  background: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '30px',
                  cursor: 'pointer',
                }}
              >
                Back to Summary
              </button>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
            ✓ Secure Checkout • ✓ Easy Returns
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;