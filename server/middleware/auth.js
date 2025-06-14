// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables, including JWT_SECRET

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header (e.g., "Bearer YOUR_TOKEN")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token part

  console.log("Auth Middleware: Received Authorization Header:", authHeader);
  console.log("Auth Middleware: Extracted Token:", token ? token.substring(0, 20) + '...' : 'No token or empty'); // Log first 20 chars for brevity

  // If no token is provided, return 401 Unauthorized
  if (token == null || token === 'null' || token === 'undefined' || token === '') { // Explicitly check for 'null' or 'undefined' string
    console.warn("Auth Middleware: No valid token found. Returning 401.");
    return res.status(401).json({ message: "No authentication token provided." });
  }

  // Verify the token using your JWT_SECRET from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => { // Renamed 'user' to 'decodedPayload' for clarity
    // If verification fails (e.g., token expired, invalid signature, malformed), return 403 Forbidden
    if (err) {
      console.error("Auth Middleware: Token verification failed:", err.message);
      // Specific error messages for better debugging (optional)
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: "Authentication token expired." });
      }
      if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
        return res.status(403).json({ message: "Malformed authentication token." });
      }
      return res.status(403).json({ message: "Invalid authentication token." });
    }

    // CRUCIAL FIX: Assign the nested 'user' object from the decoded payload to req.user
    // The payload itself contains { user: { id: ..., name: ..., email: ... } }
    if (decodedPayload && decodedPayload.user) {
      req.user = decodedPayload.user;
      console.log("Auth Middleware: Token verified. User ID:", req.user.id);
      next(); // Proceed to the next middleware or route handler
    } else {
      console.error("Auth Middleware: Decoded token payload is missing 'user' object or is malformed.");
      return res.status(403).json({ message: "Invalid token payload structure." });
    }
  });
};

module.exports = authenticateToken;
