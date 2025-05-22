const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcrypt');

const sparePartRoutes = require('./routes/sparePartRoutes');
const stockInRoutes = require('./routes/stockInRoutes');
const stockOutRoutes = require('./routes/stockOutRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/spareparts', sparePartRoutes);
app.use('/api/stockin', stockInRoutes);
app.use('/api/stockout', stockOutRoutes);
app.use('/api/auth', authRoutes);

// Use session before your routes
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
  }
}));

// Setup CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
