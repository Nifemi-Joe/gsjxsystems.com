import React, { useState } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

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
    max-width: 90%;
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

const Form = styled.div`
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

  &:hover {
    background-color: #0056b3;
  }
`;

const UserModal = ({ isOpen, onClose }) => {
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		role: "",
		password: ""
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Submit logic here
		onClose(); // Close modal after submission
	};

	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>Add New User</Title>
				<Form>
					<FormGroup>
						<Label>Name</Label>
						<Input
							type="text"
							name="name"
							value={userData.name}
							onChange={handleInputChange}
							placeholder="Enter user name"
						/>
					</FormGroup>
					<FormGroup>
						<Label>Email</Label>
						<Input
							type="email"
							name="email"
							value={userData.email}
							onChange={handleInputChange}
							placeholder="Enter user email"
						/>
					</FormGroup>
					<FormGroup>
						<Label>Role</Label>
						<Input
							type="text"
							name="role"
							value={userData.role}
							onChange={handleInputChange}
							placeholder="Enter user role"
						/>
					</FormGroup>
					<FormGroup>
					<Label>Password</Label>
					<Input
						type="password"
						name="password"
						value={userData.password}
						onChange={handleInputChange}
						placeholder="Enter user password"
					/>
				</FormGroup>
					<SubmitButton onClick={handleSubmit}>Create User</SubmitButton>
				</Form>
			</ModalContent>
		</ModalOverlay>
	);
};

export default UserModal;
