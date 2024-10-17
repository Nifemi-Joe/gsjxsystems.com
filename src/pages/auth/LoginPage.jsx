import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import LogoImage from "../../assets/images/↪︎ Web App/Icon.svg"
import {ColorRing} from "react-loader-spinner";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {AuthContext, useAuth} from "../../store/auth/AuthContext";
import {DataContext} from "../../context/DataContext";
import {useMutation} from "@tanstack/react-query";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
    /* 1. Sign Up - Empty State */

    /* Greyscale/25 */
    background: #F6F8FA;

`;

const LoginBox = styled.div`
  text-align: center;
    /* Form */

    /* Auto layout */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;
    //gap: 24px;

    width: 480px;
    /* Base/White */
    background: #FFFFFF;
    /* Greyscale/100 */
    border: 1px solid #DFE1E7;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.06);
    border-radius: 16px;

`;

const Logo = styled.div`
  margin-bottom: 20px;
  img {
    width: 50px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
	width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
	width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ForgotPasswordLink = styled.a`
  font-size: 12px;
  color: #007bff;
  text-decoration: none;
  align-self: flex-end;
  margin-bottom: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const RememberMeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RememberMeCheckbox = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #444;
  }
`;

const RegisterLink = styled.a`
  font-size: 12px;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.footer`
  margin-top: 30px;
  font-size: 12px;
  color: #999;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 20px;
`;

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { login, error, getUserDetails } = useAuth();
	const { setEmployees, setTaxes, setInvoices, setExpenses, setClients } = useContext(DataContext);
	const { setUserDetails }  = useContext(AuthContext)
	const fetchData = async () => {
		const [employeeRes, taxRes, invoiceRes, expenseRes, clientRes] = await Promise.all([
			fetch('https://tax-app-backend.onrender.com/api/employees/read').then(res => res.json()),
			fetch('https://tax-app-backend.onrender.com/api/tax/').then(res => res.json()),
			fetch('https://tax-app-backend.onrender.com/api/invoices/spoolInvoices').then(res => res.json()),
			fetch('https://tax-app-backend.onrender.com/api/expenses/read').then(res => res.json()),
			fetch('https://tax-app-backend.onrender.com/api/clients/clients/').then(res => res.json()),
		]);

		// Set the data in context
		setEmployees(employeeRes.responseData);
		setTaxes(taxRes.responseData);
		setInvoices(invoiceRes.responseData);
		setExpenses(expenseRes.responseData);
		setClients(clientRes.responseData);
	};
	const loginMutation = useMutation({
		mutationFn: async (userData) => {
			const response = await axios.post('https://tax-app-backend.onrender.com/api/user/login', userData);

			return response.data;
		},
		onSuccess: (data) => {
			setLoading(false)
			// setUserDetails(data.responseData)
			// Fetch additional data on successful login
			fetchData();
			localStorage.setItem('token', data.token);
			localStorage.setItem('id', data.responseData._id)
			const token = localStorage.getItem('token');
			const id = localStorage.getItem('id')
			getUserDetails(token, id);
			if (data.responseData.role === "superadmin" || data.responseData.role === "admin"){
				navigate("/admin/dashboard");
			}
			else {
				navigate("/dashboard");
			}
		},
		onError: (error) => {
			setLoading(false)
			toast.error(error.message || 'Login failed');
		}

	})
	// const loginMutation = useMutation(
	// 	async (userData) => {
	// 		const response = await axios.post('https://tax-app-backend.onrender.com/api/user/login', userData);
	// 		return response.data;
	// 	},
	// 	{
	// 		onSuccess: (data) => {
	// 			// Fetch additional data on successful login
	// 			fetchData();
	// 			localStorage.setItem('token', data.token);
	// 			navigate("/");
	// 		},
	// 		onError: (error) => {
	// 			toast.error(error.message || 'Login failed');
	// 		}
	// 	}
	// );


	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			loginMutation.mutate({ email: email, password: password });
			// const response = await login(email, password);
			// setLoading(false);
			let response = {}
			console.log(response)
			if (response.responseCode === "00"){
				console.log('toast is not here or is it')
				toast.success('Login successful!', {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
					transition: Bounce,
				})


			}
		} catch (err) {
			toast.error( err.message || 'Login failed', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
				transition: Bounce,
			})
			// setError(err.response.data.message || 'Login failed');
			setLoading(false);
		}
	};

	return (
		<Container>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<LoginBox>
				<Logo>
					<img src={LogoImage} alt="logo" />
				</Logo>
				<Title>Login to your account</Title>
				<SubTitle>Enter your details to login.</SubTitle>
				{error && <ErrorText>{error}</ErrorText>}
				<Form onSubmit={handleSubmit}>
					<InputGroup>
						<Label>Email</Label>
						<Input
							type="email"
							placeholder="Exz@financial.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</InputGroup>
					<InputGroup>
						<Label>Password</Label>
						<Input
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</InputGroup>
					<RememberMeWrapper>
						<label>
							<RememberMeCheckbox type="checkbox" />
							Remember me
						</label>
						<ForgotPasswordLink href="/forgot-password">Forgot Password?</ForgotPasswordLink>
					</RememberMeWrapper>
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
					) : <Button type="submit">Sign In</Button>}

				</Form>
				{/*<p>*/}
				{/*	Don’t have an account?{' '}*/}
				{/*	<RegisterLink href="/register">Register</RegisterLink>*/}
				{/*</p>*/}
				<Footer>©2024 Financial Dashboard</Footer>
			</LoginBox>
		</Container>
	);
};

export default LoginForm;
