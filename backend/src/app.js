const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const articleRoutes = require('./routes/articleRoutes');

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/articles', articleRoutes);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ error: 'Internal Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

module.exports = app;
