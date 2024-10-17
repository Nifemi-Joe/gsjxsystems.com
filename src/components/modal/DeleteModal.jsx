import React from 'react';
import styled from 'styled-components';
import {ColorRing} from "react-loader-spinner";

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
  color: #f44336; /* Red to indicate deletion */
`;

const ModalText = styled.p`
  font-size: 16px;
  color: #333;
  margin-top: 12px;
  margin-bottom: 24px;
`;

const ModalButton = styled.button`
  padding: 10px 24px;
  background-color: #f44336;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #d32f2f;
  }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  background-color: #ccc;
  color: #333;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-right: 12px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #999;
  }
`;

const DeleteModal = ({ isOpen, onClose, onDelete, itemName,loading }) => {
	if (!isOpen) return null;

	return (
		<Overlay>
			<ModalContainer>
				<ModalHeader>Delete Item</ModalHeader>
				<ModalText>Are you sure you want to delete <strong>{itemName.name}</strong>?</ModalText>

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
				) : <div>
					<CancelButton onClick={onClose}>Cancel</CancelButton>
					<ModalButton onClick={()=> onDelete(itemName)}>Delete</ModalButton>
				</div>}
			</ModalContainer>
		</Overlay>
	);
};

export default DeleteModal;
