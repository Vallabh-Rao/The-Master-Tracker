import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear all stored data
        setUser(null);
    };

    // Add this temporary button to force logout for testing
    const forceLogout = () => {
        localStorage.clear();
        setUser(null);
        window.location.reload(); // Refresh the page
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading Security Karma...</div>
                {/* Add force logout button for testing */}
                <button 
                    onClick={forceLogout}
                    className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                    Force Logout
                </button>
            </div>
        );
    }

    return (
        <div className="App">
            {/* Add force logout button for testing */}
            {user && (
                <button 
                    onClick={forceLogout}
                    className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded text-sm"
                >
                    Force Logout (Testing)
                </button>
            )}
            
            {user ? (
                <Dashboard user={user} onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;