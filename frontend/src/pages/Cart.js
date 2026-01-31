// src/pages/Cart.js
//&  1. State Management
//&  2. Fetching Cart Data
//&  3. Calculate Cart Total Calculation
//&  4. Order Submission - After Order button is clicked
//&  5. Conditional Rendering


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

//! Several useState hooks to manage dynamic parts of the page
const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //! When false, the user sees the "Order Summary"; when true, the "Shipping Form" appears.
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

  // ?It looks for a token in 'localStorage'
  // ?LocalStorage -> a web browser API used to persistently 
  // ?store small amounts of data as key-value pairs on the user's computer. 
  // ? This data has no expiration time
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view your cart');
      setLoading(false);
      return;
    }

    //? Fetches cart data - 
    //! It sends a GET request to ${process.env.REACT_APP_API_URL}/cart
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

  //? calculating the price of the product using .reduce method 
  const total = cart.reduce((sum, item) => {
    const price = item?.product?.price ?? 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setFormError('');
  };

  //! checks empty fields and ensure phone number 10 digits
  const validateAddress = () => {
    if (!address.fullName.trim()) return 'Full name is required';
    if (!address.phone.match(/^\d{10}$/)) return 'Enter valid 10-digit phone number';
    if (!address.addressLine1.trim()) return 'Address line 1 is required';
    if (!address.city.trim()) return 'City is required';
    if (!address.state.trim()) return 'State is required';
    if (!address.pincode.match(/^\d{6}$/)) return 'Enter valid 6-digit pincode';
    return '';
  };
// --- RAZORPAY LOGIC ---
  const handlePlaceOrder = async () => {
    const validationError = validateAddress();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      // 1. Create an order on your backend
      const orderRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/pay`, 
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { amount, id: order_id, currency } = orderRes.data;

      // 2. Initialize Razorpay Options
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
        amount: amount,
        currency: currency,
        name: "ōly beauty",
        description: "Complete your aesthetic ritual",
        order_id: order_id,
        handler: async (response) => {
          // 3. This runs after successful payment
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/orders`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                items: cart.map(item => ({
                  product: item.product._id,
                  quantity: item.quantity || 1,
                })),
                totalAmount: total,
                shippingAddress: address,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/order-success');
          } catch (err) {
            alert("Payment recorded, but order failed. Please contact support.");
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: "#e91e63" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Payment Error:', err);
      setFormError('Could not initiate payment. Try again.');
    }
  };

  if (loading) return <div className="text-center py-40 italic text-slate-400">Loading your cart...</div>;
  if (error) return <div className="text-center py-40"><h2>{error}</h2><Link to="/login" className="text-rose-600">Login to view cart</Link></div>;

  return (
    <div className="container px-6 py-20 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif-aesthetic italic mb-10">Your Bag</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Side: Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cart.map((item, index) => (
            <div key={index} className="flex gap-6 border-b pb-6 items-center">
              <img 
                src={item?.product?.image ? `${process.env.REACT_APP_API_URL}${item.product.image}` : 'https://placehold.co/120x140'} 
                className="w-24 h-32 object-cover rounded-xl"
                alt={item.product?.name}
              />
              <div>
                <h3 className="font-bold">{item.product?.name}</h3>
                <p className="text-rose-600">₹{item.product?.price}</p>
                <p className="text-slate-400 text-sm italic">Qty: {item.quantity || 1}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Checkout Form */}
        <div className=" p-8 rounded-3xl shadow-sm border border-slate-50 h-fit">
          <h3 className="text-xl font-bold mb-6">Summary</h3>
          <div className="flex justify-between mb-4"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
          <div className="flex justify-between mb-6 font-bold text-lg border-t pt-4"><span>Total</span><span className="text-rose-600">₹{total.toFixed(2)}</span></div>

          {!showCheckoutForm ? (
            <button onClick={() => setShowCheckoutForm(true)} className="w-full bg-slate-900 text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-rose-600 transition-colors">Proceed to Checkout</button>
          ) : (
            <div className="space-y-4">
              <input name="fullName" placeholder="Full Name" onChange={handleAddressChange} className="w-full p-3 border rounded-xl" />
              <input name="phone" placeholder="Phone" onChange={handleAddressChange} className="w-full p-3 border rounded-xl" />
              <input name="addressLine1" placeholder="Address" onChange={handleAddressChange} className="w-full p-3 border rounded-xl" />
              <div className="flex gap-2">
                <input name="city" placeholder="City" onChange={handleAddressChange} className="w-1/2 p-3 border rounded-xl" />
                <input name="pincode" placeholder="Pincode" onChange={handleAddressChange} className="w-1/2 p-3 border rounded-xl" />
              </div>
              <button onClick={handlePlaceOrder} className="w-full bg-rose-600 text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs">Pay with Razorpay</button>
              <button onClick={() => setShowCheckoutForm(false)} className="w-full text-slate-400 text-xs uppercase tracking-widest mt-2">Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;  