require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this line
const pool = require('./config/dbPool');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', authenticate, vehicleRoutes);
app.use('/api/services', authenticate, serviceRoutes);


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

    app.get('/*splat', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
});

}

const PORT = process.env.PORT || 5555;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
