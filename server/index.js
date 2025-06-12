require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/dbPool');

const app = express();
app.use(cors());
app.use(express.json());

// Import authentication middleware
const authenticateToken = require('./middleware/auth'); // Make sure this path is correct

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// Public routes (authentication is not required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication IS required)
// Apply the authenticateToken middleware before the route handlers
app.use('/api/vehicles', authenticateToken, vehicleRoutes);
app.use('/api/services', authenticateToken, serviceRoutes); // Assuming service routes also require authentication


// Simple health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      message: 'Fleetly API is running'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err.message
    });
  }
});

// Serve static files from React in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, 'public');
  app.use(express.static(clientBuildPath));

  // For any other GET request, serve the index.html
  app.get('/*splat', (req, res) => { // Changed from '/*splat' for broader catch-all
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5555;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
