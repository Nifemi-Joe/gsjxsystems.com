import styled from "styled-components";
import Search from "../../assets/images/search-line.svg";
import { Button } from "../table/EnhancedTable";
import Plus from "../../assets/images/add-line.svg";
import { Container } from "./BalanceCard";
import Stack from "../../assets/images/stack-line.svg";
import Draft from "../../assets/images/draft-line.svg";
import Cash from "../../assets/images/exchange-dollar-line.svg";
import Hands from "../../assets/images/hand-coin-line.svg";
import UserTable from "../table/UserTable"; // Replace with the appropriate User table component
import Calendar from "../../assets/images/calendar-todo-line.svg";
import ChevronDown from "../../assets/images/arrow-down-s-line.svg";
import Add from "../../assets/images/add-line-grey.svg";
import { CSVLink } from "react-csv";
import React, { useContext, useEffect, useMemo, useState } from "react";
import CancelIcon from "../../assets/images/close-icon.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import * as XLSX from "xlsx";
import AddUserModal from "../modal/AddUserModal"; // Replace with the User modal
import axios from "axios";
import { DataContext } from "../../context/DataContext";
import {DownloadButton,AddContainer, DownloadContainer, DropdownItem, DropdownMenu} from "./ExpenseCard";

// Styling components (same as in EmployeeCard)
const RevenueContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 48px;
`;
const ContainerTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContainerTopLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  h3 {
    font-weight: 600;
    font-size: 18px;
    color: rgb(25, 25, 29);
  }
  p {
    color: rgb(100, 100, 103);
  }
`;

const ContainerTopRight = styled.div`
  display: flex;
  gap: 16px;
	position: relative;
  align-items: center;
  width: 50%;
  justify-content: end;
`;

const SearchInput = styled.input`
  height: 44px;
  border: 1px solid rgb(237, 237, 237);
  padding: 10px 30px 10px 44px;
  border-radius: 30px;
  width: 100%;
`;

const PurpleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: rgb(250, 247, 254);
`;

const YellowContainer = styled(PurpleContainer)`
  background: rgb(255, 249, 245);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  h5 {
    font-size: 14px;
    font-weight: 500;
  }
  h2 {
    font-size: 32px;
    font-weight: 600;
  }
`;

const UserCard = () => {
	const { users } = useContext(DataContext); // Fetching users from the context

	const csvData = users.map((user) => ({
		Username: user.name || user.firstname + " " + user.lastname,
		Email: user.email,
		Role: user.role,
		PhoneNumber: user.phoneNumber,

		Status: user.status,
		DateJoined: user.createdAt,
	}));
	const handleDownloadClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};
	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
		XLSX.writeFile(workbook, "Users.xlsx");
	};

	const [type, setType] = useState("add");
	const [selectedUser, setSelectedUser] = useState({});
	const [isModalOpen, setModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleOpenModal = () => {
		setType("add");
		setModalOpen(true);
	};

	const handleCloseModal = () => setModalOpen(false);

	const filteredRows = useMemo(() => {
		return users.filter(
			(user) =>
				(user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(user.firstname && user.firstname.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(user.surname && user.surname.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(user.middlename && user.middlename.toLowerCase().includes(searchQuery.toLowerCase())) ||

				user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.status.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [searchQuery, users]);

	return (
		<RevenueContainer>
			<ContainerTop>
				<ContainerTopLeft>
					<h3>Users</h3>
					<p>Manage users in the system</p>
				</ContainerTopLeft>
				<ContainerTopRight>
					<SearchInput
						placeholder="Search & Filter"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
					<img src={Search} alt="Search" className="absolute top-2.5 left-3" />
					<AddContainer onClick={handleOpenModal}>
						<img src={Add} alt="Add" />
					</AddContainer>
					<DownloadContainer>
						<DownloadButton isActive={isDropdownOpen} onClick={handleDownloadClick}>
							{/*<img src={isDropdownOpen ? CancelIcon : ArrowDown} alt="Download" />*/}
						</DownloadButton>
						<DropdownMenu isOpen={isDropdownOpen}>
							<CSVLink data={csvData} filename={"Audit Logs.csv"}>
								<DropdownItem>Download as CSV</DropdownItem>
							</CSVLink>
							<DropdownItem href="#" onClick={exportToExcel}>Download as Excel</DropdownItem>
						</DropdownMenu>
					</DownloadContainer>
				</ContainerTopRight>
			</ContainerTop>

			{/* User Summary */}
			<div className="flex gap-3">
				<Container>
					<PurpleContainer>
						<img src={Stack} alt="Stack" />
					</PurpleContainer>
					<TextContainer>
						<h3>Total Users</h3>
						<h2>{users.length || 0}</h2>
					</TextContainer>
				</Container>
				<Container>
					<YellowContainer>
						<img src={Draft} alt="Draft" />
					</YellowContainer>
					<TextContainer>
						<h3>Active Users</h3>
						<h2>{users.filter((user) => user.status.toLowerCase() === "active").length || 0}</h2>
					</TextContainer>
				</Container>
			</div>

			{/* User Table */}
			<UserTable users={filteredRows} onEdit={setSelectedUser} />
			<AddUserModal isOpen={isModalOpen} onClose={handleCloseModal} type={type} userData={selectedUser} />
		</RevenueContainer>
	);
};

export default UserCard;
