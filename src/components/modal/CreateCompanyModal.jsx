import React, { useState, useContext } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { ColorRing } from 'react-loader-spinner';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from "../../context/DataContext";

// Styled Components for the Modal
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #ffffff;
    padding: 40px;
    border-radius: 10px;
    width: 500px;
    max-height: 80vh;
    overflow: scroll;
    max-width: 90%;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.4s ease-out;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    font-size: 20px;
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    color: #333;

    &:hover {
        color: #ff5a5f;
    }
`;

const Title = styled.h3`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #555;
	text-align: left;
`;

const Input = styled.input`
    padding: 12px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

const SubmitButton = styled.button`
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const CreateCompanyModal = ({ isOpen, onClose, onSave }) => {
	const { setCompanies } = useContext(DataContext); // Assuming you have a context to manage companies
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const token = localStorage.token;
			const response = await axios.post('https://tax-app-backend.onrender.com/api/companies', formData, {headers: {Authorization: `Bearer ${token}`}});
			if (response.data.responseCode === "00") {
				toast.success('Company added successfully!', {
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
				setCompanies(prev => [...prev, response.data.company]); // Update your companies context
				onSave(); // Call onSave to refresh the company list
			} else {
				toast.error(response.data.responseMessage || "Error adding company", {
					position: "top-right",
					autoClose: 5000,
				});
			}
		} catch (error) {
			console.error('Error saving company data:', error);
		} finally {
			setLoading(false);
			onClose(); // Close modal after submission
		}
	};

	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ToastContainer />
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>Add Company</Title>
				<Form onSubmit={handleSubmit}>
					<FormGroup>
						<Label>Name</Label>
						<Input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter company name"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label>Email</Label>
						<Input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Enter email"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label>Phone Number</Label>
						<Input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							placeholder="Enter phone number"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label>Address</Label>
						<Input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleChange}
							placeholder="Enter address"
							required
						/>
					</FormGroup>
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
						<SubmitButton type="submit">Add Company</SubmitButton>
					)}
				</Form>
			</ModalContent>
		</ModalOverlay>
	);
};

export default CreateCompanyModal;
