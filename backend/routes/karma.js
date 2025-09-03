const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user profile and karma info
router.get('/profile', authenticateToken, async (req, res) => {
    console.log('👤 Profile request for user:', req.user.userId);
    
    try {
        const profile = await User.getProfile(req.user.userId);
        
        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        
        res.json({
            success: true,
            profile: profile
        });
    } catch (error) {
        console.error('❌ Profile fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch profile',
            message: error.message
        });
    }
});

// Record a security action and update karma
router.post('/action', authenticateToken, async (req, res) => {
    console.log('⚡ Action recorded by user:', req.user.userId, req.body);
    
    try {
        const { actionType, details } = req.body;
        
        if (!actionType) {
            return res.status(400).json({ error: 'actionType is required' });
        }
        
        // Define karma points for different actions
        const actionPoints = {
            'password_check_weak': 2,
            'password_check_medium': 5,
            'password_check_strong': 10,
            'mfa_enabled': 20,
            'phishing_quiz_passed': 8,
            'security_update': 5,
            'risky_behavior': -10,
            'two_factor_setup': 20,
            'backup_created': 15
        };

        const points = actionPoints[actionType];
        
        if (points === undefined) {
            return res.status(400).json({ 
                error: 'Invalid action type',
                validActions: Object.keys(actionPoints)
            });
        }
        
        const result = await User.updateKarma(req.user.userId, points, actionType);
        
        console.log('✅ Karma updated:', result);
        
        res.json({
            success: true,
            message: `Great job! You earned ${points} karma points!`,
            points_earned: result.points_earned,
            new_karma_score: result.karma_score,
            security_level: result.security_level,
            action_type: actionType
        });
    } catch (error) {
        console.error('❌ Action recording error:', error);
        res.status(500).json({ 
            error: 'Failed to record action',
            message: error.message
        });
    }
});

// Get recent actions for a user
router.get('/actions', authenticateToken, async (req, res) => {
    console.log('📊 Actions request for user:', req.user.userId);
    
    try {
        const db = require('../database/connection');
        
        db.all(
            `SELECT action_type, points_earned, details, timestamp 
             FROM actions 
             WHERE user_id = ? 
             ORDER BY timestamp DESC 
             LIMIT 10`,
            [req.user.userId],
            (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching actions:', err);
                    res.status(500).json({ error: 'Failed to fetch actions' });
                } else {
                    res.json({
                        success: true,
                        actions: rows
                    });
                }
            }
        );
    } catch (error) {
        console.error('❌ Actions fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch actions' });
    }
});

module.exports = router;