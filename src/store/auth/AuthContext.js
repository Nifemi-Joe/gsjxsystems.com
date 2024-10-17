import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [authData, setAuthData] = useState(null);
	const [userDetails, setUserDetails] = useState({
		companyId: "",
		permissions: [],
		role: ""
	});
	const [error, setError] = useState(null);
	const [sessionTimeout, setSessionTimeout] = useState(false)
	const [company, setCompany]  = useState({})
	const login = async (email, password) => {
		try {
			const response = await axios.post('https://tax-app-backend.onrender.com/api/user/login', { email, password });
			setAuthData(response.data);
			localStorage.setItem('token', response.data.token);
			setError(null);
			setSessionTimeout(false)
			return response.data;
		} catch (err) {
			setError(err.response.data.message || 'Login failed');
			return null;
		}
	};

	const logout = () => {
		setAuthData(null);
		setUserDetails(null);
		// localStorage.removeItem('token');
	};

	const getUserDetails = async (token, id) => {
		const toke = localStorage.token;
		try {
			const response = await axios.get(`https://tax-app-backend.onrender.com/api/user/read-by-id/${id}`, {
				headers: {
					Authorization: `Bearer ${toke}`,
				},
			});

			setSessionTimeout(false)
			setUserDetails(response.data.responseData);
			console.log(response.data.responseData)
			const companyResponse = await axios.get(`https://tax-app-backend.onrender.com/api/company/read-by-id/${response.data.responseData.companyId}`, {headers: {Authorization: `Bearer ${toke}`}});
			setCompany(companyResponse.data.responseData)
			console.log(companyResponse.data.responseData)

		} catch (err) {
			setSessionTimeout(true);
			console.error('Failed to fetch user details:', err);
			logout();
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		const id = localStorage.getItem('id');

		if (token) {
			setAuthData({ token });
			getUserDetails(token, id);
		}
	}, []);

	useEffect(() => {
		if (authData?.token) {
			const id = localStorage.getItem('id');
			const intervalId = setInterval(() => {
				getUserDetails(authData.token, id);
			}, 300000); // Fetch user details every 5 minutes

			return () => clearInterval(intervalId);
		}
	}, [authData]);

	return (
		<AuthContext.Provider value={{ authData, userDetails, login, logout, error, getUserDetails, company, sessionTimeout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
