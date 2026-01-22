const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;    
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

const isSeller = (req, res, next) => {
  console.log("DEBUG: User data from token ->", req.user); 
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Only sellers can perform this action.' });
  }
};

module.exports = { protect, isSeller };
