const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    console.log('📝 Registration attempt:', req.body.email);
    
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: 'All fields are required',
                required: ['username', 'email', 'password']
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists with this email' 
            });
        }

        // Create new user
        const newUser = await User.create(username, email, password);
        
        console.log('✅ User created successfully:', newUser.id);
        
        res.status(201).json({
            message: 'User created successfully! Welcome to Security Karma!',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                karma_score: 0,
                security_level: 'Rookie'
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            error: 'Registration failed',
            message: error.message
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    console.log('🔐 Login attempt:', req.body.email);
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        const result = await User.authenticate(email, password);
        
        console.log('✅ Login successful for user:', result.user.id);
        
        res.json({
            message: 'Login successful! Welcome back to Security Karma!',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(401).json({ 
            error: 'Invalid credentials',
            message: 'Please check your email and password'
        });
    }
});

module.exports = router;