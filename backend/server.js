const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize database connection first
require('./database/connection');

// Import routes (after database is initialized)
const authRoutes = require('./routes/auth');
const karmaRoutes = require('./routes/karma');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/karma', karmaRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '🛡️ Security Karma API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// 404 handler → This should be the LAST middleware
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Security Karma Server Started Successfully!`);
    console.log(`📡 API available at: http://localhost:${PORT}/api`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`💾 Database: SQLite (./database/security_karma.db)`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
