import React, { useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999999;
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
  color: ${({ type }) => (type === 'success' ? '#4CAF50' : '#f44336')}; /* Green for success, red for error */
`;

const ModalText = styled.p`
  font-size: 16px;
  color: #333;
  margin-top: 12px;
  margin-bottom: 24px;
`;

const ModalButton = styled.button`
  padding: 10px 24px;
  background-color: ${({ type }) => (type === 'success' ? '#4CAF50' : '#f44336')};
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${({ type }) => (type === 'success' ? '#388E3C' : '#d32f2f')};
  }
`;

const ResponseModal = ({ isOpen, onClose, message, type = 'success', autoClose = true, autoCloseTime = 1000000 }) => {

	// Auto-close the modal after a delay if enabled
	useEffect(() => {
		if (isOpen && autoClose) {
			const timer = setTimeout(() => {
				onClose();
			}, autoCloseTime);

			return () => clearTimeout(timer); // Cleanup timeout
		}
	}, [isOpen, autoClose, autoCloseTime, onClose]);

	if (!isOpen) return null;

	return (
		<Overlay>
			<ModalContainer>
				<ModalHeader type={type}>{type === 'success' ? 'Success' : 'Error'}</ModalHeader>
				<ModalText>{message}</ModalText>
				<ModalButton type={type} onClick={onClose}>
					Close
				</ModalButton>
			</ModalContainer>
		</Overlay>
	);
};

export default ResponseModal;
