import React, { useState, useEffect } from 'react';
import KarmaDisplay from '../components/KarmaDisplay';
import PasswordTester from '../components/PasswordTester';
import { karma, auth } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
    const [profile, setProfile] = useState(user);
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
        loadActions();
    }, []);

    const loadProfile = async () => {
        try {
            const result = await karma.getProfile();
            setProfile(result.profile);
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    };

    const loadActions = async () => {
        try {
            const result = await karma.getActions();
            setActions(result.actions || []);
        } catch (error) {
            console.error('Failed to load actions:', error);
        }
    };

    const handleActionComplete = () => {
        loadProfile(); // Refresh profile to get updated karma
        loadActions(); // Refresh actions list
    };

    const handleLogout = () => {
        auth.logout();
        onLogout();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionIcon = (actionType) => {
        const icons = {
            'password_check_weak': '🔓',
            'password_check_medium': '🔒',
            'password_check_strong': '🔐',
            'mfa_enabled': '🛡️',
            'phishing_quiz_passed': '🎣',
            'security_update': '🔄'
        };
        return icons[actionType] || '⚡';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white">
                            🛡️ Security Karma
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300">Welcome, {profile?.username}!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Karma Display */}
                    <div className="lg:col-span-1">
                        <KarmaDisplay user={profile} />
                        
                        {/* User Stats */}
                        <div className="bg-gray-800 rounded-lg p-4 mt-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Stats</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total Actions:</span>
                                    <span className="text-blue-400">{actions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Points Earned:</span>
                                    <span className="text-green-400">
                                        +{actions.reduce((sum, a) => sum + Math.max(0, a.points_earned), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Actions */}
                    <div className="lg:col-span-1">
                        <PasswordTester onActionComplete={handleActionComplete} />
                    </div>

                    {/* Right: Recent Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Recent Actions</h3>
                            
                            {actions.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No actions yet!</p>
                                    <p className="text-sm text-gray-500">Complete your first security task.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {actions.slice(0, 10).map((action, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl">
                                                    {getActionIcon(action.action_type)}
                                                </span>
                                                <div>
                                                    <p className="text-white text-sm font-medium">
                                                        {action.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </p>
                                                    <p className="text-gray-400 text-xs">
                                                        {formatDate(action.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${action.points_earned > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {action.points_earned > 0 ? '+' : ''}{action.points_earned}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;