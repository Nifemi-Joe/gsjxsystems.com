import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { ColorRing } from 'react-loader-spinner';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataContext} from "../../context/DataContext";
import Select from "react-select";

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
  max-height: 90vh;
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

const CreateRateModal = ({ isOpen, onClose, rateData, onSave, type }) => {
	const [loading, setLoading] = useState(false);
	const {setRates} = useContext(DataContext)
	const [formData, setFormData] = useState({
		value: null,
		date: new Date().toISOString().split("T")[0],
		currency: "USD"
	});

	// useEffect(() => {
	// 	if (rateData) {
	// 		setFormData(rateData);
	// 	}
	// }, [rateData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "value"){
			setFormData({
				...formData,
				[name]: Number(value),
			});
		}
		else {
			setFormData({
				...formData,
				[name]: value,
			});
		}

	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (type === "edit") {
			// Update rate
			const response = await axios.put(`https://tax-app-backend.onrender.com/api/rates/${rateData.id}`, formData);
			toast.success('Rate updated successfully!', {
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
		}
		else {
			// Create new rate
			const response = await axios.post('https://tax-app-backend.onrender.com/api/rate/create', formData);
			const ratesResponse = await axios.get('https://tax-app-backend.onrender.com/api/rate/read', {});
			setRates(ratesResponse.data.responseData)
			if (response.data.responseCode === "00"){
				toast.success('Rate added successfully!', {
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
				onClose()
			}
			else {
				toast.error(response.data.responseMessage, {
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
			}

		}
		setLoading(false);
	};
	const options = [
		{ value: "USD", label: "American Dollar (USD)" },
		{ value: "GDP", label: "British Pounds (GDP)" },
	]

	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ToastContainer />
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>{type === "edit" ? 'Edit Rate' : 'Add Rate'}</Title>
				<Form onSubmit={handleSubmit}>
					<FormGroup>
						<Label>Currency</Label>
						<Select name="currency" onChange={(selectedOption) => setFormData({ ...formData, currency: selectedOption.value })}
						        value={options.find((option) => option.value ===  formData.currency)}
						        options={options}
						>
						</Select>
					</FormGroup>

					<FormGroup>
						<Label>Rate</Label>
						<Input
							type="number"
							name="value"
							step="any"
							value={formData.value}
							onChange={handleChange}
							placeholder="Enter rate value"
							required
						/>
					</FormGroup>

					<FormGroup>
						<Label>Date</Label>
						<Input
							type="date"
							max={new Date().toISOString().split("T")[0]}
							name="date"
							value={formData.date}
							onChange={handleChange}
							placeholder="Enter date"
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
						<SubmitButton type="submit">
							{type === "edit" ? 'Update Rate' : 'Add Rate'}
						</SubmitButton>
					)}
				</Form>
			</ModalContent>
		</ModalOverlay>
	);
};

export default CreateRateModal;
