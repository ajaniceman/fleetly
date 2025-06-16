// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables, including JWT_SECRET

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("Auth Middleware: Received Authorization Header:", authHeader);
  console.log("Auth Middleware: Extracted Token:", token ? token.substring(0, 20) + '...' : 'No token or empty');

  if (token == null || token === 'null' || token === 'undefined' || token === '') {
    console.warn("Auth Middleware: No valid token found. Returning 401.");
    return res.status(401).json({ message: "No authentication token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error("Auth Middleware: Token verification failed:", err.message);
      if (err.name === 'TokenExpiredError') {
        // CRUCIAL CHANGE: Return 401 Unauthorized for expired tokens
        return res.status(401).json({ message: "Authentication token expired. Please log in again." });
      }
      if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
        return res.status(403).json({ message: "Malformed authentication token." });
      }
      // For any other JWT error (invalid signature, etc.)
      return res.status(403).json({ message: "Invalid authentication token." });
    }

    if (decodedPayload && decodedPayload.user) {
      req.user = decodedPayload.user;
      console.log("Auth Middleware: Token verified. User ID:", req.user.id);
      next();
    } else {
      console.error("Auth Middleware: Decoded token payload is missing 'user' object or is malformed.");
      return res.status(403).json({ message: "Invalid token payload structure." });
    }
  });
};

module.exports = authenticateToken;
