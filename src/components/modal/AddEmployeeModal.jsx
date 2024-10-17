import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { FaTimes, FaInfoCircle  } from "react-icons/fa";
import axios from "axios";
import { ColorRing } from 'react-loader-spinner';
import {ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DataContext} from "../../context/DataContext";
import Select from "react-select";
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import ResponseModal from "./ResponseModal";

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
    max-height: 80vh;
    border-radius: 10px;
    width: 500px;
    max-width: 90%;
	overflow: scroll;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
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
    position: relative;
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

const InfoIcon = styled(FaInfoCircle)`
    position: absolute;
    right: 15px;
    top: 48px;
    color: #007bff;
    cursor: pointer;
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

const AddEmployeeModal = ({ isOpen, onClose, employeeData, onSave, type }) => {
	const [loading, setLoading] = useState(false);
	const [openResponseModal, setOpenResponseModal] = useState(false);
	const [responseType, setResponseType] = useState('success');
	const [responseMessage, setResponseMessage] = useState()
	const [formData, setFormData] = useState({
		firstname: type === "edit" ? employeeData.firstname : employeeData.name ? employeeData.name : "",
		middlename: type === "edit" ? employeeData.middlename : "",
		surname: type === "edit" ? employeeData.surname : "",
		email: type === "edit" ? employeeData.email : "",
		department: type === "edit" ? employeeData.department : "",
		phoneNumber: type === "edit" ? employeeData.phoneNumber : "",
		position: type === "edit" ? employeeData.position : "",
		salary: type === "edit" ? employeeData.department : "",
		status: type === "edit" ? employeeData.status : "active",
	});
	const {setEmployees} = useContext(DataContext)
	const handleClose = () => {
		if (responseType === "success"){
			setOpenResponseModal(false);
			onClose()
		}
		else {
			setOpenResponseModal(false);
		}
	}

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
			if (type === 'edit') {
				// Update employee
				const response = await axios.put(`https://tax-app-backend.onrender.com/api/employees/update/${employeeData._id}`, formData, {headers: {Authorization: `Bearer ${token}`}});
				const data = await axios.get('https://tax-app-backend.onrender.com/api/employees/read/', {headers: {Authorization: `Bearer ${token}`}})
				setEmployees(data.data.responseData)
				toast.success('Employee updated successfully!', {
					position: "top-right",
					autoClose: 5000,
					theme: "light",
					transition: Bounce,
				});
				onClose()
			} else {
				// Create new employee
				const response = await axios.post('https://tax-app-backend.onrender.com/api/employees/create/', formData, {headers: {Authorization: `Bearer ${token}`}});
				if (response.data.responseCode === "00"){
					setOpenResponseModal(true);
					setResponseType('success');
					setResponseMessage('Employee added successfully!');
					const data = await axios.get('https://tax-app-backend.onrender.com/api/employees/read/', {headers: {Authorization: `Bearer ${token}`}})
					setEmployees(data.data.responseData)
					toast.success('Employee added successfully!', {
						position: "top-right",
						autoClose: 5000,
						theme: "light",
						transition: Bounce,
					});
				}
				else {
					setOpenResponseModal(true);
					setResponseType('error');
					if (response.data.responseMessage && response.data.responseMessage.includes('authorized')){
						setResponseMessage('You are not authorized to create employees.')
					}
					else if(response.data.responseMessage){
						setResponseMessage(response.data.responseMessage)
					}
					else if (response.data.errors){
						setResponseMessage(response.data.errors[0].msg);
					}
					else{
						setResponseMessage(response.data.message)
					}
				}

			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setOpenResponseModal(true);
			setResponseType('error');
			if (error.response.data.responseMessage && error.response.data.responseMessage.includes('authorized')){
				setResponseMessage('You are not authorized to create invoices.')
			}
			else if(error.response.data.responseMessage){
				setResponseMessage(error.response.data.responseMessage)
			}
			else if (error.response.data.errors){
				setResponseMessage(error.response.data.errors[0].msg);
			}
			else{
				setResponseMessage(error.response.data.message)
			}
			console.log(error)
			toast.error(error.response && error.response.data.message || error.message, {
				position: "top-right",
				autoClose: 5000,
				theme: "light",
				transition: Bounce,
			});
			console.error('Error saving employee data:', error);
		}
	};
	const options = [
		{ value: "active", label: "Active" },
		{ value: "retired", label: "Retirement" },
		{ value: "resigned", label: "Resigned" },
		{ value: "termination", label: "Termination" },
		{ value: "inactive", label: "inactive" },
	]

	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ToastContainer />
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>{type === "edit" ? 'Edit Employee' : 'Add Employee'}</Title>
				<Form onSubmit={handleSubmit}>
					<FormGroup>
						<Label>First Name</Label>
						<Input
							type="text"
							name="firstname"
							value={formData.firstname}
							onChange={handleChange}
							placeholder="Enter first name"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label>Middle Name</Label>
						<Input
							type="text"
							name="middlename"
							value={formData.middlename}
							onChange={handleChange}
							placeholder="Enter middle name"
						/>
					</FormGroup>
					<FormGroup>
						<Label>Last Name</Label>
						<Input
							type="text"
							name="surname"
							value={formData.surname}
							onChange={handleChange}
							placeholder="Enter last name"
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
						<InfoIcon data-tooltip-id="email" data-tip="Format: example@domain.com" />
						<Tooltip place="top" id="email" type="dark" effect="solid" >Format: example@domain.com</Tooltip>
					</FormGroup>
					<FormGroup>
						<Label>Phone Number</Label>
						<Input
							type="tel"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							placeholder="Enter phone number"
							required
							min={5}
							max={24}
						/>
						<InfoIcon data-tooltip-id="phone" data-tip="Format: +1234567890" />
						<Tooltip id="phone" key="top" place="top" type="dark" effect="solid">Format: +1234567890</Tooltip>
					</FormGroup>
					<FormGroup>
						<Label>Department</Label>
						<Input
							type="text"
							name="department"
							value={formData.department}
							onChange={handleChange}
							placeholder="Enter department"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label>Position</Label>
						<Input
							type="text"
							name="position"
							value={formData.position}
							onChange={handleChange}
							placeholder="Enter position"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label>Salary</Label>
						<Input
							type="number"
							name="salary"
							value={formData.salary}
							onChange={handleChange}
							placeholder="Enter salary"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label>Status</Label>
						<Select
							name="category"
							value={options.find(option => option.value === employeeData.status)}
							onChange={(selectedOption) => setFormData({ ...formData, status: selectedOption.value })}
							required
							options={options}
						/>
					</FormGroup>
					{loading ? (
						<div className="flex items-center justify-center">
							<ColorRing
								visible={true}
								height="80"
								width="80"
								ariaLabel="color-ring-loading"
								colors={['#007bff', '#007bff', '#007bff', '#007bff', '#007bff']}
							/>
						</div>
					) : (
						<SubmitButton type="submit">
							{employeeData ? 'Update Employee' : 'Add Employee'}
						</SubmitButton>
					)}
				</Form>
			</ModalContent>
			<ResponseModal type={responseType} onClose={handleClose} message={responseMessage} isOpen={openResponseModal}/>
		</ModalOverlay>
	);
};

export default AddEmployeeModal;
