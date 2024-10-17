import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";
import { ColorRing } from 'react-loader-spinner';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataContext} from "../../context/DataContext";
import ResponseModal from "./ResponseModal";
import {useAuth} from "../../store/auth/AuthContext";
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

const AddClientModal = ({ isOpen, onClose, clientData, onSave, type, handleEdit }) => {
	const {setClients} = useContext(DataContext);
	const {userDetails} = useAuth();
	const [loading, setLoading] = useState(false);
	const [openResponse, setOpenResponse] = useState(false);
	const [message, setMessage] = useState('')
	const [typeResponse, setTypeResponse] = useState(null)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: 0,
		address: '',
		company: '',
		createdBy: userDetails ? userDetails._id : "",
		status: 'active',
		companyId: userDetails ? userDetails.companyId : ""
	});
	const options = [
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'pending', label: 'Pending' },
	];
	useEffect(() => {
		if (clientData) {
			setFormData(clientData);
		}
	}, [clientData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};
	const handleResponseClose = () => {
		setOpenResponse(false);
		onClose()
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.token;
		setLoading(true);
		try {
			if (type === 'edit') {
				formData.companyId = userDetails.companyId;
				formData.updatedBy = userDetails._id;
				// Update client
				const response = await axios.put(`https://tax-app-backend.onrender.com/api/clients/update-client/${clientData._id}`, formData, {headers: {Authorization: `Bearer ${token}`}});
				const clients = await axios.get(`https://tax-app-backend.onrender.com/api/clients/clients/`, {headers: {Authorization: `Bearer ${token}`}});
				setClients(clients.data.responseData);
				if (response.data.responseCode === "00"){
					setOpenResponse(true);
					setTypeResponse('success');
					setMessage('Client updated successfully!')
					toast.success('Client updated successfully!', {
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
					onSave()
				}
				else {
					setOpenResponse(true);
					setTypeResponse('error');
					setMessage(response.data.responseMessage || response.responseMessage )
					toast.error(   response.errors > 0 && response.errors[0].msg || response.responseMessage || response.message, {
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

				setLoading(false);
			}
			else {
				formData.createdBy = userDetails._id;
				formData.companyId = userDetails.companyId;
				// Create new client
				const response = await axios.post('https://tax-app-backend.onrender.com/api/clients/', formData, {headers: {Authorization: `Bearer ${token}`}});
				const clients = await axios.get(`https://tax-app-backend.onrender.com/api/clients/clients/`, {headers: {Authorization: `Bearer ${token}`}});
				setClients(clients.data.responseData)
				if (response.data.responseCode === "00"){
					setOpenResponse(true);
					setTypeResponse('success');
					setMessage('Client added successfully!')
					toast.success('Client added successfully!', {
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
					onSave()
				}
				else {
					setOpenResponse(true);
					setTypeResponse('error');
					setMessage(response.data.responseMessage || response.responseMessage );
					toast.error(response.errors > 0 && response.errors[0].msg ||response.data.responseMessage || response.message, {
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
					createNotification('error', response.responseMessage || response.message);
				}
				setLoading(false);
			}
		} catch (error) {
			onSave()
			setLoading(false);
			setOpenResponse(true);
			setTypeResponse('error');
			console.error('Error saving client data:', error);
			const clients = await axios.get(`https://tax-app-backend.onrender.com/api/clients/clients/`, {headers: {Authorization: `Bearer ${token}`}});
			setClients(clients.data.responseData)
			if (error.response.data.errors){
				setMessage(error.response.data.errors[0].msg);
			}
			else if (error.response.data.responseMessage && error.response.data.responseMessage.includes('authorized')){
				setMessage("You are not authorized to create clients")
			}
			else if (error.response.data.responseMessage){
				setMessage(error.response.data.responseMessage)
			}
			else{
				setMessage(error.response.data.message)
			}
		}
	};
	const createNotification = (type, message) => {
		switch (type) {
			case 'info':
				NotificationManager.info(message);
				break;
			case 'success':
				NotificationManager.success(message, 'Success');
				break;
			case 'warning':
				NotificationManager.warning(message, 'Warning', 3000);
				break;
			case 'error':
				NotificationManager.error(message, 'Error', 5000);
				break;
			default:
				break;
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
				<Title>{clientData ? 'Edit Client' : 'Add Client'}</Title>
				<Form onSubmit={handleSubmit}>
					<FormGroup>
						<Label>Name</Label>
						<Input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter client name"
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
					<FormGroup>
						<Label>Status</Label>
						<Select
							name="status"
							required
							value={options.find(option => option.value === formData.status)}
							onChange={(selectedOption) => setFormData({ ...formData, status: selectedOption.value })}							required
							options={options}
						>
						</Select>
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
					) :<SubmitButton type="submit">
						{clientData ? 'Update Client' : 'Add Client'}
					</SubmitButton> }

				</Form>
			</ModalContent>
			<ResponseModal isOpen={openResponse} type={typeResponse} onClose={handleResponseClose} message={message}/>
		</ModalOverlay>
	);
};

export default AddClientModal;


