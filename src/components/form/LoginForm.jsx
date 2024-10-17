import React, {useContext, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import {DataContext} from "../../context/DataContext";
import {useMutation} from "@tanstack/react-query";


const LoginForm = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { setEmployees, setTaxes, setInvoices, setExpenses, setClients } = useContext(DataContext);

	const fetchData = async () => {
		const [employeeRes, taxRes, invoiceRes, expenseRes, clientRes] = await Promise.all([
			fetch('/api/employees').then(res => res.json()),
			fetch('/api/taxes').then(res => res.json()),
			fetch('/api/invoices').then(res => res.json()),
			fetch('/api/expenses').then(res => res.json()),
			fetch('/api/clients').then(res => res.json()),
		]);

		// Set the data in context
		setEmployees(employeeRes);
		setTaxes(taxRes);
		setInvoices(invoiceRes);
		setExpenses(expenseRes);
		setClients(clientRes);
	};
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const loginMutation = useMutation('https://tax-app-backend.onrender.com/api/user/login', {
		onSuccess: () => {
			fetchData();
		},
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			loginMutation.mutate({ username: formData.email, password: formData.password });
			const response = await axios.post('https://tax-app-backend.onrender.com/api/user/login', formData);
			localStorage.setItem('token', response.data.token); // Store token in localStorage
			navigate('/dashboard'); // Redirect to dashboard on success
		} catch (err) {
			setError(err.response.data.message || 'Login failed');
		}
	};

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Email"
					required
				/>
				<input
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					placeholder="Password"
					required
				/>
				{loading ? (
					<div className="flex items-center justify-center">
						<ColorRing
							visible={true}
							height="80"
							width="80"
							ariaLabel="color-ring-loading"
							wrapperStyle={{}}
							wrapperClass="color-ring-wrapper"
							colors={['#007bff', '#007bff', '#007bff', '#007bff', '#007bff']}
						/>
					</div>
				) : <button type="submit">Login</button>}

				{error && <p>{error}</p>}
			</form>
		</div>
	);
};

export default LoginForm;
