import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { ColorRing } from "react-loader-spinner";
import { Bounce, toast, ToastContainer } from "react-toastify";
import LogoImage from "../../assets/images/↪︎ Web App/Icon.svg";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #F6F8FA;
`;

const RegisterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  width: 480px;
  background: #FFFFFF;
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

const RegisterForm = () => {
	const [companyName, setCompanyName] = useState('');
	const [email, setEmail] = useState('');
	const [adminFirstName, setAdminFirstName] = useState('');
	const [adminLastName, setAdminLastName] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		const role = "clientAdmin"
		try {
			const response = await axios.post('https://your-api.com/api/company/register', {
				companyName,
				email,
				password,
				adminFirstName,
				adminLastName,
				role
			});

			setLoading(false);
			if (response.data.responseCode === "00") {
				toast.success('Registration successful!', {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
					transition: Bounce,
				});

				navigate("/login"); // Redirect to login page after successful registration
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			setLoading(false);
			toast.error(error.message || 'Registration failed');
		}
	};

	return (
		<Container>
			<ToastContainer />
			<RegisterBox>
				<Logo>
					<img src={LogoImage} alt="logo" />
				</Logo>
				<Title>Register Your Company</Title>
				<SubTitle>Enter company and admin details to create an account.</SubTitle>
				<Form onSubmit={handleRegister}>
					<InputGroup>
						<Label>Company Name</Label>
						<Input
							type="text"
							placeholder="Enter your company name"
							value={companyName}
							onChange={(e) => setCompanyName(e.target.value)}
							required
						/>
					</InputGroup>
					<div className="flex gap-2">
						<InputGroup>
							<Label>Admin First Name</Label>
							<Input
								type="text"
								placeholder="Enter your admin first name"
								value={adminFirstName}
								onChange={(e) => setAdminFirstName(e.target.value)}
								required
							/>
						</InputGroup>
						<InputGroup>
							<Label>Admin Last Name</Label>
							<Input
								type="text"
								placeholder="Enter your admin last name"
								value={adminLastName}
								onChange={(e) => setAdminLastName(e.target.value)}
								required
							/>
						</InputGroup>
					</div>

					<InputGroup>
						<Label>Email</Label>
						<Input
							type="email"
							placeholder="Enter admin email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</InputGroup>
					<InputGroup>
						<Label>Password</Label>
						<Input
							type="password"
							placeholder="Create a password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</InputGroup>
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
					) : (
						<Button type="submit">Register</Button>
					)}
				</Form>
				<p>
					Already have an account?{' '}
					<RegisterLink href="/login">Login</RegisterLink>
				</p>
				<Footer>©2024 Financial Dashboard</Footer>
			</RegisterBox>
		</Container>
	);
};

export default RegisterForm;
