// src/components/modal/UnauthorizedModal.js

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 15px;
  padding: 40px;
  width: 500px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #5459ea;
`;

const ModalText = styled.p`
  font-size: 16px;
  color: #333;
  margin-top: 12px;
  margin-bottom: 24px;
`;

const ModalButton = styled.button`
  padding: 10px 24px;
  background-color: #5459ea;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #454bc9;
  }
`;

const UnauthorizedModal = ({ isOpen, onClose }) => {
	const navigate = useNavigate();

	const handleLoginRedirect = () => {
		onClose(); // Close the modal
		navigate('/login'); // Redirect to login page
	};

	if (!isOpen) return null;

	return (
		<Overlay>
			<ModalContainer>
				<ModalHeader>Session Expired</ModalHeader>
				<ModalText>Your session has expired. Please log in again to continue.</ModalText>
				<ModalButton onClick={handleLoginRedirect}>Go to Login</ModalButton>
			</ModalContainer>
		</Overlay>
	);
};

export default UnauthorizedModal;

