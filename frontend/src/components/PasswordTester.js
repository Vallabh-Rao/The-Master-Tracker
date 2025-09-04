import React, { useState } from 'react';
import { karma } from '../services/api';

const PasswordTester = ({ onActionComplete }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const checkPasswordStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score += 2;
        if (pwd.length >= 12) score += 2;
        if (/[A-Z]/.test(pwd)) score += 2;
        if (/[a-z]/.test(pwd)) score += 2;
        if (/[0-9]/.test(pwd)) score += 2;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 3;
        return score;
    };

    const testPassword = async () => {
        if (!password) return;
        
        setLoading(true);
        setMessage('');

        const strength = checkPasswordStrength(password);
        let actionType;
        
        if (strength >= 10) actionType = 'password_check_strong';
        else if (strength >= 7) actionType = 'password_check_medium';
        else actionType = 'password_check_weak';

        try {
            const result = await karma.recordAction(actionType, `Password strength: ${strength}/12`);
            setMessage(`🎉 ${result.message}`);
            onActionComplete();
            setPassword('');
            
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Failed to test password');
        } finally {
            setLoading(false);
        }
    };

    const quickAction = async (type, name, points) => {
        setLoading(true);
        try {
            const result = await karma.recordAction(type, name);
            setMessage(`🎉 ${result.message}`);
            onActionComplete();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Action failed');
        } finally {
            setLoading(false);
        }
    };

    const getStrengthInfo = () => {
        if (!password) return { text: '', color: '' };
        
        const strength = checkPasswordStrength(password);
        if (strength >= 10) return { text: 'Very Strong 💪', color: 'text-green-400' };
        if (strength >= 7) return { text: 'Strong 👍', color: 'text-yellow-400' };
        if (strength >= 4) return { text: 'Weak ⚠️', color: 'text-orange-400' };
        return { text: 'Very Weak 🚨', color: 'text-red-400' };
    };

    const strengthInfo = getStrengthInfo();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Security Actions</h2>

            {message && (
                <div className="bg-blue-600 text-white p-3 rounded-lg">
                    {message}
                </div>
            )}

            {/* Password Tester */}
            <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                    🔐 Password Strength Test
                </h3>
                
                <div className="space-y-3">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a password to test"
                        className="w-full p-3 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                    
                    {password && (
                        <p className={`text-sm ${strengthInfo.color}`}>
                            {strengthInfo.text}
                        </p>
                    )}
                    
                    <button
                        onClick={testPassword}
                        disabled={loading || !password}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Testing...' : 'Test Password'}
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">🔒 Enable MFA</h3>
                    <button
                        onClick={() => quickAction('mfa_enabled', 'MFA Setup', 20)}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                        Simulate MFA Setup (+20 pts)
                    </button>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">🔄 Security Update</h3>
                    <button
                        onClick={() => quickAction('security_update', 'System Update', 5)}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                        Install Update (+5 pts)
                    </button>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">🎣 Phishing Quiz</h3>
                    <button
                        onClick={() => quickAction('phishing_quiz_passed', 'Phishing Awareness', 8)}
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                        Take Quiz (+8 pts)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordTester;