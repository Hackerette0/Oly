// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log('[PROTECT] Incoming request to protected route');
  console.log('[PROTECT] Authorization header:', req.headers.authorization || 'missing');

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.log('[PROTECT] Missing or invalid Authorization header');
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    console.log('[PROTECT] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[PROTECT] Decoded:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('[PROTECT] User not found for id:', decoded.id);
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user;
    console.log('[PROTECT] Auth success - user ID:', req.user._id);
    next();
  } catch (err) {
    console.error('[PROTECT] Error during verification:');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    return res.status(401).json({ msg: 'Not authorized - token verification failed' });
  }
};

const isSeller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ msg: 'Not authorized as seller' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ msg: 'Not authorized as admin' });
  }
};

module.exports = { protect, isSeller, isAdmin };