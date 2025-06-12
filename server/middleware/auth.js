// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables, including JWT_SECRET

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header (e.g., "Bearer YOUR_TOKEN")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token part

  // If no token is provided, return 401 Unauthorized
  if (token == null) {
    return res.status(401).json({ message: "No authentication token provided." });
  }

  // Verify the token using your JWT_SECRET from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If verification fails (e.g., token expired, invalid signature), return 403 Forbidden
    if (err) {
      console.error("Token verification failed:", err.message);
      // Specific error messages for better debugging (optional)
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: "Authentication token expired." });
      }
      return res.status(403).json({ message: "Invalid authentication token." });
    }

    // If verification is successful, attach the decoded user payload to the request object
    // The 'user' object here will be { id: userId } as per your generateToken function
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
