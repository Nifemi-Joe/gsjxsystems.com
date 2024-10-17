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
    overflow-y: auto; // Allow scrolling if content exceeds max height
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

const AuditInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const AuditField = styled.div`
    font-size: 14px;
    span {
        font-weight: 600;
        color: #555;
    }
`;

const ViewAuditModal = ({ isOpen, onClose, audit }) => {
	if (!isOpen) return null; // Only render modal if it's open and audit data is available

	return (
		<ModalOverlay>
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>Audit Information</Title>
				<AuditInfo>
					<AuditField>
						<span>Action: </span> {audit.action}
					</AuditField>
					<AuditField>
						<span>User: </span> {audit.userName}
					</AuditField>
					<AuditField>
						<span>Module: </span> {audit.module}
					</AuditField>
					<AuditField>
						<span>Description: </span> {audit.details}
					</AuditField>
					<AuditField>
						<span>Date: </span> {new Date(audit.timestamp).toLocaleString()}
					</AuditField>

					<AuditField>
						<span>Ip Address: </span> {audit.ipAddress || "--"} {/* Assuming changes is an array */}
					</AuditField>
				</AuditInfo>
			</ModalContent>
		</ModalOverlay>
	);
};

export default ViewAuditModal;
