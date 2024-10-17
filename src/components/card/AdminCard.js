import React, { useState } from 'react';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom';
import UserAdd from "../../assets/images/user-add-line.svg";
import UserManage from "../../assets/images/user-settings-line.svg";
import CompanyAdd from "../../assets/images/first-aid-kit-line.svg";
import CompanyManage from "../../assets/images/briefcase-4-line.svg";
import AuditLog from "../../assets/images/file-shield-2-line.svg";
import ResetPassword from "../../assets/images/admin-line.svg";
import UserModal from '../modal/AddUserModal'; // Import the UserModal component
import CompanyModal from '../modal/AddCompanyModal'; // Import the CompanyModal component

// Admin Container
const AdminModuleContainer = styled.div`
    padding: 24px;
    border-radius: 30px;
    background-color: #f8f8fa;
    min-height: 100vh;
`;

// Header for Admin Module
const ModuleHeader = styled.h3`
    font-weight: 600;
    font-size: 24px;
    color: #19191d;
    margin-bottom: 24px;
`;

// Container for Admin Activity Cards
const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
`;

// Styled Admin Activity Card
const AdminCards = styled.div`
    padding: 16px;
    cursor: pointer;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &:hover {
        transform: scale(1.05);
    }

    h4 {
        font-size: 18px;
        font-weight: 500;
        color: #19191d;
        margin-bottom: 12px;
    }

    p {
        font-size: 14px;
        color: #8c97ac;
    }

    img {
        width: 40px;
        height: 40px;
        margin-bottom: 16px;
    }
`;

// Example data for admin activities
const adminActivities = [
	{ id: 1, name: 'Create User', description: 'Add a new user to the platform', modal: 'user', route: "#", icon: UserAdd },
	{ id: 2, name: 'View Users', description: 'Manage and view all users', route: '/admin/users', icon: UserManage },
	{ id: 3, name: 'Create Company', description: 'Add a new company to a user', modal: 'company', route: "#", icon: CompanyAdd },
	{ id: 4, name: 'Manage Companies', description: 'Manage registered companies', route: '/admin/companies', icon: CompanyManage },
	{ id: 5, name: 'View Audit Logs', description: 'Review system activity logs', route: '/admin/audit-logs', icon: AuditLog },
	{ id: 6, name: 'Reset User Password', description: 'Reset a user’s password', route: '/admin/reset-password', icon: ResetPassword },
];

const AdminCard = () => {
	// State to control modals
	const [showUserModal, setShowUserModal] = useState(false);
	const [showCompanyModal, setShowCompanyModal] = useState(false);
	const navigate = useNavigate()
	// Function to handle card clicks
	const handleCardClick = (modal, route) => {
		console.log(modal)
		if (modal === 'user') {
			setShowUserModal(true);
		} else if (modal === 'company') {
			setShowCompanyModal(true);
		}
		else {
			navigate(route)
		}

	};

	return (
		<AdminModuleContainer>
			<ModuleHeader>Admin Activities</ModuleHeader>
			<CardContainer>
				{adminActivities.map((activity) => (
					<div
						key={activity.id}
						onClick={() => handleCardClick(activity.modal, activity.route)} // Trigger modal on click
						style={{ textDecoration: 'none' }}
					>
						<AdminCards>
							<img src={activity.icon} alt={activity.name} />
							<h4>{activity.name}</h4>
							<p>{activity.description}</p>
						</AdminCards>
					</div>
				))}
			</CardContainer>
			<UserModal onClose={() => setShowUserModal(false)} isOpen={showUserModal} />
			<CompanyModal onClose={() => setShowCompanyModal(false)} isOpen={showCompanyModal}/>
		</AdminModuleContainer>
	);
};

export default AdminCard;
