import React, { useState } from 'react';
import { auth } from '../services/api';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (isLogin) {
                result = await auth.login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                await auth.register(formData);
                result = await auth.login({
                    email: formData.email,
                    password: formData.password
                });
            }
            
            onLogin(result.user);
        } catch (error) {
            setError(error.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        🛡️ Security Karma
                    </h1>
                    <p className="text-gray-400">
                        {isLogin ? 'Sign in to continue' : 'Create your account'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required={!isLogin}
                                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter username"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                        {isLogin 
                            ? "Don't have an account? Sign up" 
                            : "Already have an account? Sign in"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;