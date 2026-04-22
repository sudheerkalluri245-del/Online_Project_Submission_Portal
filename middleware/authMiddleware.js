// ===========================
// middleware/authMiddleware.js - JWT Protector
// ===========================
// This middleware runs BEFORE protected routes.
// It checks if the request has a valid JWT token.
// If valid, it attaches the user info to req.user.
// If invalid, it blocks the request with a 401 error.

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Tokens are sent in the 'Authorization' header as:
  // "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  // Extract just the token part (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our secret key
    // If the token is valid, 'decoded' will contain the payload we signed
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to the request so routes can use it
    // e.g., req.user.id gives us the logged-in user's ID
    req.user = decoded;
    
    next(); // Proceed to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to restrict access to a specific role
// Usage: protect, restrictTo('faculty')
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Only ${roles.join('/')} can perform this action.` 
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
