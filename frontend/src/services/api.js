import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth functions
export const auth = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
};

// Karma functions
export const karma = {
    getProfile: async () => {
        const response = await api.get('/karma/profile');
        return response.data;
    },

    recordAction: async (actionType, details) => {
        const response = await api.post('/karma/action', { actionType, details });
        return response.data;
    },

    getActions: async () => {
        const response = await api.get('/karma/actions');
        return response.data;
    }
};

export default api;