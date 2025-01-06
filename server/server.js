require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const comandaRoutes = require('./routes/comandaRoutes');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Test database connection
db.getConnection((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the application if the database connection fails
    }
    console.log('Connected to the MySQL database');
});

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/comanda', comandaRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'An internal server error occurred.',
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});