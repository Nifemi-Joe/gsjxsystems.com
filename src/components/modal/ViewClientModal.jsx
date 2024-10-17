import React from 'react';
import styled from 'styled-components';
import { FaTimes } from "react-icons/fa";  // Assuming you use this for closing the modal

// Styled-components (reuse similar ones you used in other modals)
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

const ClientInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ClientField = styled.div`
    font-size: 14px;
    span {
        font-weight: 600;
        color: #555;
    }
`;

const ViewClientModal = ({ isOpen, onClose, client }) => {
	if (!isOpen || !client) return null; // Only render modal if it's open and client data is available

	return (
		<ModalOverlay>
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>Client Information</Title>
				<ClientInfo>
					<ClientField>
						<span>Name: </span> {client.name}
					</ClientField>
					<ClientField>
						<span>Email: </span> {client.email}
					</ClientField>
					<ClientField>
						<span>Phone: </span> {client.phone}
					</ClientField>
					<ClientField>
						<span>Address: </span> {client.address}
					</ClientField>
					<ClientField>
						<span>Total Invoices: </span> {client.clientTotalInvoice}
					</ClientField>
					<ClientField>
						<span>Amount Due: </span> {client.clientAmountDue}
					</ClientField>
					<ClientField>
						<span>Amount Paid: </span> {client.clientAmountPaid}
					</ClientField>
					<ClientField>
						<span>Status: </span> {client.status}
					</ClientField>
					{/*<ClientField>*/}
					{/*	<span>Company: </span> {client.company.name} /!* Assuming company has a name field *!/*/}
					{/*</ClientField>*/}
					<ClientField>
						<span>Created At: </span> {new Date(client.createdAt).toLocaleDateString()}
					</ClientField>
					<ClientField>
						<span>Last Updated: </span> {new Date(client.updatedAt).toLocaleDateString()}
					</ClientField>
				</ClientInfo>
			</ModalContent>
		</ModalOverlay>
	);
};

export default ViewClientModal;
