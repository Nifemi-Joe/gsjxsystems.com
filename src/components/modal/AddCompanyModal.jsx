// src/components/company/AddCompanyModal.js

import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataContext } from "../../context/DataContext";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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
  //text-align: center;
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

const CompanyStatusOptions = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
	{ value: "pending", label: "Pending" },
	{ value: "suspended", label: "Suspended" },
];

const AddCompanyModal = ({ isOpen, onClose, companyData, onSave, type }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: type === "edit" ? companyData.name : "",
		email: type === "edit" ? companyData.email : "",
		phoneNumber: type === "edit" ? companyData.phoneNumber : "",
		address: type === "edit" ? companyData.address : "",
		status: type === "edit" ? companyData.status : "active",
	});

	const { setCompanies } = useContext(DataContext);

	useEffect(() => {
		if (type === "edit" && companyData) {
			setFormData({
				name: companyData.name || "",
				email: companyData.email || "",
				phoneNumber: companyData.phoneNumber || "",
				address: companyData.address || "",
				status: companyData.status || "active",
			});
		} else {
			setFormData({
				name: "",
				email: "",
				phoneNumber: "",
				address: "",
				status: "active",
			});
		}
	}, [type, companyData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleStatusChange = (selectedOption) => {
		setFormData({
			...formData,
			status: selectedOption.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (type === "edit") {
				// Update company
				const response = await axios.put(
					`https://tax-app-backend.onrender.com/api/companies/update/${companyData._id}`,
					formData
				);
				const data = await axios.get(
					"https://tax-app-backend.onrender.com/api/companies/read/"
				);
				setCompanies(data.data.responseData);
				toast.success("Company updated successfully!", {
					position: "top-right",
					autoClose: 5000,
					theme: "light",
					transition: Bounce,
				});
				onClose();
			} else {
				// Create new company
				const response = await axios.post(
					"https://tax-app-backend.onrender.com/api/companies/create/",
					formData
				);
				if (response.data.responseCode === "00") {
					const data = await axios.get(
						"https://tax-app-backend.onrender.com/api/companies/read/"
					);
					setCompanies(data.data.responseData);
					toast.success("Company added successfully!", {
						position: "top-right",
						autoClose: 5000,
						theme: "light",
						transition: Bounce,
					});
					onClose();
				} else {
					toast.error(response.data.responseMessage || "Error adding company", {
						position: "top-right",
						autoClose: 5000,
						theme: "light",
						transition: Bounce,
					});
				}
			}
			setLoading(false);
			onSave();
		} catch (error) {
			setLoading(false);
			toast.error(
				error.response?.data?.message || error.message,
				{
					position: "top-right",
					autoClose: 5000,
					theme: "light",
					transition: Bounce,
				}
			);
			console.error("Error saving company data:", error);
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
				<Title>{type === "edit" ? "Edit Company" : "Add Company"}</Title>
				<Form onSubmit={handleSubmit}>
					<FormGroup>
						<Label>Company Name</Label>
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
						<InfoIcon data-tooltip-id="email" data-tip="Format: example@domain.com" />
						<Tooltip id="email" place="top" effect="solid">
							Format: example@domain.com
						</Tooltip>
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
						/>
						<InfoIcon data-tooltip-id="phone" data-tip="Format: +1234567890" />
						<Tooltip id="phone" place="top" effect="solid">
							Format: +1234567890
						</Tooltip>
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
							options={CompanyStatusOptions}
							onChange={handleStatusChange}
							value={CompanyStatusOptions.find(
								(option) => option.value === formData.status
							)}
							placeholder="Select status"
							required
						/>
					</FormGroup>
					{loading ? (
						<div className="flex items-center justify-center">
							<ColorRing
								visible={true}
								height="45"
								width="45"
								ariaLabel="blocks-loading"
								wrapperStyle={{}}
								wrapperClass="blocks-wrapper"
								colors={["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]}
							/>
						</div>
					) : (
						<SubmitButton type="submit">
							{type === "edit" ? "Update Company" : "Add Company"}
						</SubmitButton>
					)}
				</Form>
			</ModalContent>
		</ModalOverlay>
	);
};

export default AddCompanyModal;
