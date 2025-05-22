const express  = require('express');
const cors     = require('cors');
const session  = require('express-session');
require('dotenv').config();

const sparePartRoutes = require('./routes/sparePartRoutes');
const stockInRoutes   = require('./routes/stockInRoutes');
const stockOutRoutes  = require('./routes/stockOutRoutes');
const authRoutes      = require('./routes/authRoutes');

const app = express();

/* ---------- 1. CORS (only once, FIRST) ---------- */
app.use(cors({
  origin: 'http://localhost:3000',   // ⬅️ exact front-end origin
  credentials: true                  // ⬅️ allow cookies / sessions
}));

/* ---------- 2. Body parser ---------- */
app.use(express.json());

/* ---------- 3. Session middleware BEFORE routes ---------- */
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,                   // true only behind HTTPS
    maxAge: 1000 * 60 * 60 * 24      // 1 day
  }
}));

/* ---------- 4. Routes ---------- */
app.use('/api/spareparts', sparePartRoutes);
app.use('/api/stockin',   stockInRoutes);
app.use('/api/stockout',  stockOutRoutes);
app.use('/api/auth',      authRoutes);

/* ---------- 5. Start server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
