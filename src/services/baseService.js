// src/services/baseService.js

import axios from 'axios';
import eventEmitter from './eventEmitter'; // Adjust the path based on your project structure

// Create an instance of axios
const axiosInstance = axios.create({
	baseURL: 'https://tax-app-backend.onrender.com/api', // Base URL of your API
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
	(config) => {
		// Get the token from local storage
		const token = localStorage.getItem('token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`; // Attach the token
		}
		return config;
	},
	(error) => {
		// Handle request error
		return Promise.reject(error);
	}
);

// Add a response interceptor to handle unauthorized responses
axiosInstance.interceptors.response.use(
	(response) => response, // Pass through successful responses
	(error) => {
		if (error.response && error.response.status === 401) {
			// Emit an 'unauthorized' event
			eventEmitter.emit('unauthorized');
		}
		return Promise.reject(error); // Reject the promise for further handling
	}
);

export default axiosInstance;
