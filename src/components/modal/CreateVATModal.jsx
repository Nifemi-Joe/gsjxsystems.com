// components/modal/CreateVATModal.js

import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import {Bounce, toast} from "react-toastify";
import {DataContext} from "../../context/DataContext";
import ResponseModal from "./ResponseModal";
import {useAuth} from "../../store/auth/AuthContext";
import {ColorRing} from "react-loader-spinner";

const CreateVATModal = ({ isOpen, onClose, onAdd, onEdit, editMode = false, existingVAT = null }) => {
	const [vat, setVatt] = useState(editMode ? existingVAT.value : '');
	const [loading, setLoading] = useState(false);
	const {userDetails} = useAuth();
	const [error, setError] = useState('');
	const {setVat} = useContext(DataContext);
	const [openResponse, setOpenResponse] = useState(false);
	const [message, setMessage] = useState('');
	const [typeResponse, setTypeResponse] = useState(null);

	const handleResponseClose = () => {
		setOpenResponse(false);
		onClose();
	};

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Basic validation
		if (!vat) {
			setError('VAT Rate is required.');
			setLoading(false);
			return;
		}
		if (vat < 0) {
			setError('VAT Rate cannot be negative.');
			setLoading(false);
			return;
		}

		const token = localStorage.token;
		try {
			const endpoint = editMode
				? `https://tax-app-backend.onrender.com/api/vat/${existingVAT.id}`
				: 'https://tax-app-backend.onrender.com/api/vat/';
			const method = editMode ? 'put' : 'post';
			const response = await axios[method](
				endpoint,
				{ value: vat, companyId: userDetails.companyId, createdBy: userDetails._id },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setLoading(false);
			setOpenResponse(true);

			if (response.data.responseCode === "00") {
				setTypeResponse('success');
				setMessage(editMode ? 'VAT updated successfully!' : 'VAT added successfully!');
				setVat(response.data.responseData);
				editMode ? onEdit(response.data.responseData) : onAdd(response.data.responseData);
				onClose();
			} else {
				setTypeResponse('error');
				setMessage(response.data.responseMessage);
			}
		} catch (err) {
			setLoading(false);
			setOpenResponse(true);
			setTypeResponse('error');
			setMessage('An error occurred while saving the VAT.');
		}
	};

	return (
		<Overlay>
			<ModalContainer>
				<Header>
					<h2>{editMode ? 'Edit VAT Rate' : 'Add New VAT Rate'}</h2>
					<CloseButton onClick={onClose}>
						<FaTimes />
					</CloseButton>
				</Header>
				<Form onSubmit={handleSubmit}>
					<Label>VAT</Label>
					<Input
						type="number"
						value={vat}
						onChange={(e) => setVatt(e.target.value)}
						placeholder="Enter VAT"
						required
						min="0"
						step="0.01"
					/>
					{error && <ErrorText>{error}</ErrorText>}
					{loading ? (
						<ColorRing
							visible={true}
							height="80"
							width="80"
							ariaLabel="color-ring-loading"
							colors={['#007bff', '#007bff', '#007bff', '#007bff', '#007bff']}
						/>
					) : (
						<Button type="submit">{editMode ? 'Update VAT' : 'Add VAT'}</Button>
					)}
				</Form>
			</ModalContainer>
			<ResponseModal isOpen={openResponse} type={typeResponse} onClose={handleResponseClose} message={message} />
		</Overlay>
	);
};


export default CreateVATModal;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  width: 500px;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;

const Form = styled.form`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-size: 14px;
`;
