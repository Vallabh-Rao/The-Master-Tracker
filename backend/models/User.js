const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');

class User {
    // Create new user
    static async create(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(`
                INSERT INTO users (username, email, password_hash) 
                VALUES (?, ?, ?)
            `);
            
            stmt.run([username, email, hashedPassword], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, username, email, karma_score: 0 });
                }
            });
            stmt.finalize();
        });
    }

    // Find user by email
    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    // Authenticate user
    static async authenticate(email, password) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) {
                throw new Error('Invalid password');
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    karma_score: user.karma_score,
                    security_level: user.security_level
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Update karma score
    static async updateKarma(userId, points, actionType) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // Start transaction
                db.run('BEGIN TRANSACTION');

                // Update user karma
                db.run(
                    'UPDATE users SET karma_score = karma_score + ?, last_active = CURRENT_TIMESTAMP WHERE id = ?',
                    [points, userId],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            reject(err);
                            return;
                        }

                        // Record the action
                        db.run(
                            'INSERT INTO actions (user_id, action_type, points_earned) VALUES (?, ?, ?)',
                            [userId, actionType, points],
                            function(err) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    reject(err);
                                    return;
                                }

                                // Get updated user info
                                db.get(
                                    'SELECT karma_score, security_level FROM users WHERE id = ?',
                                    [userId],
                                    (err, row) => {
                                        if (err) {
                                            db.run('ROLLBACK');
                                            reject(err);
                                        } else {
                                            db.run('COMMIT');
                                            
                                            // Update security level based on karma
                                            const newLevel = User.calculateSecurityLevel(row.karma_score);
                                            if (newLevel !== row.security_level) {
                                                db.run(
                                                    'UPDATE users SET security_level = ? WHERE id = ?',
                                                    [newLevel, userId]
                                                );
                                            }

                                            resolve({
                                                karma_score: row.karma_score,
                                                security_level: newLevel,
                                                points_earned: points
                                            });
                                        }
                                    }
                                );
                            }
                        );
                    }
                );
            });
        });
    }

    // Calculate security level based on karma
    static calculateSecurityLevel(karmaScore) {
        if (karmaScore >= 300) return 'Cyber Knight';
        if (karmaScore >= 150) return 'Sentinel';
        if (karmaScore >= 50) return 'Guardian';
        return 'Rookie';
    }

    // Get user profile
    static async getProfile(userId) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT id, username, email, karma_score, security_level, created_at, last_active 
                FROM users WHERE id = ?`,
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }
}

module.exports = User;