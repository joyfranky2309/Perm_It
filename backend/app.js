const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN ,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

module.exports = app;
