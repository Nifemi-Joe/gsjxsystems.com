import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { Header, HeaderLeft, HeaderRight, NotificationCounter, SearchImage } from "./DashboardCard";
import Search from "../../assets/images/search-line.svg";
import Notification from "../../assets/images/notification-01.svg";
import CancelIcon from "../../assets/images/close-icon.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import EnhancedTable from "../table/EnhancedTable";
import AddClientModal from "../modal/AddClientModal";
import {
	AddContainer,
	DateContainer,
	DateInput,
	DownloadButton,
	DownloadContainer,
	DropdownItem,
	DropdownMenu,
	ExpenseBodyHeader,
	ExpenseHeader,
	SearchInput
} from "./ExpenseCard";
import Calendar from "../../assets/images/calendar-todo-line.svg";
import ChevronDown from "../../assets/images/arrow-down-s-line.svg";
import Add from "../../assets/images/add-line-grey.svg";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import CreateInvoiceModal from "../modal/CreateInvoiceModal";
import { DataContext } from "../../context/DataContext";
import {useAuth} from "../../store/auth/AuthContext"; // Import the AddClientModal component

const ClientCard = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
	const [clientData, setClientData] = useState(null);
	const [clients, setClients] = useState([])
	const [type, setType] = useState('add');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	let csvData = [];
	if (clients) {
		csvData = clients.map(row => ({
			Name: row.name,
			Address: row.address,
			ClientAmountDue: row.clientAmountDue,
			ClientTotalInvoice: row.clientTotalInvoice,
			Email: row.email,
			Phone: row.phone,
			Status: row.status,
			CreatedAt: row.createdAt,
		}));
	}

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
		XLSX.writeFile(workbook, "Clients.xlsx");
	};

	useEffect(() => {
		fetchClients();
	}, []);

	const fetchClients = async () => {
		const token = localStorage.token;
		try {
			const response = await axios.get('https://tax-app-backend.onrender.com/api/clients/clients/', {headers: {Authorization: `Bearer ${token}`}});
			if (response.data.responseCode === "00"){
				setClients(response.data.responseData);
			}
			// Process the data as needed
		} catch (error) {
			console.error('Error fetching clients:', error);
		}
	};

	const handleAddClient = () => {
		setType('add');
		setIsModalOpen(true);
	};

	const handleAddInvoice = () => {
		setIsInvoiceModalOpen(true);
	};

	const handleEditClient = (client) => {
		setType('edit');
		setClientData(client);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleInvoiceCloseModal = () => {
		setIsInvoiceModalOpen(false);
	};

	const handleSaveClient = () => {
		fetchClients(); // Refresh client list after saving
		handleCloseModal();
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const toggleDatePicker = () => {
		setIsDatePickerOpen(!isDatePickerOpen);
	};

	const handleStartDateChange = (event) => {
		setStartDate(event.target.value);
	};

	const handleEndDateChange = (event) => {
		setEndDate(event.target.value);
	};

	const handleAddClick = () => {
		setIsModalOpen(true);
	};

	const handleDownloadClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const filteredRows = useMemo(() => {
		if (clients){
			return clients.filter(row => {
				const createdAtDate = new Date(row.createdAt); // Convert createdAt to Date
				const start = new Date(startDate);
				const end = new Date(endDate);
				if (startDate && endDate) {
					return (
						(row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
							row.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
						createdAtDate >= start && createdAtDate <= end // Filter by date range
					);
				}
				else {
					return clients
				}

			});
		}
		else {
			return []
		}
	}, [searchQuery, clients, startDate, endDate]);

	return (
		<div className="flex flex-col gap-4">
			<ExpenseHeader className="flex-row bg-white">
				<h3>Clients</h3>
				<ExpenseBodyHeader>
					<div className="relative w-1/2">
						<SearchInput placeholder="Search & Filter" value={searchQuery} onChange={handleSearchChange}/>
						<img src={Search} alt="Search" className="absolute top-2.5 left-3"/>
					</div>
					<div className="flex">
						<DateInput
							type="date"
							value={startDate}
							onChange={handleStartDateChange}
							onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when interacting with date input
						/>
						<DateInput
							type="date"
							value={endDate}
							onChange={handleEndDateChange}
							onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when interacting with date input
						/>
					</div>
					<AddContainer onClick={handleAddClient}>
						<img src={Add} alt="Add"/>
					</AddContainer>
					<DownloadContainer>
						<DownloadButton isActive={isDropdownOpen} onClick={handleDownloadClick}>
							<img src={isDropdownOpen ? CancelIcon : ArrowDown} alt="Download"/>
						</DownloadButton>
						<DropdownMenu isOpen={isDropdownOpen}>
							<CSVLink data={csvData} filename={"Clients.csv"}>
								<DropdownItem>Download as CSV</DropdownItem>
							</CSVLink>
							<DropdownItem href="#" onClick={exportToExcel}>Download as Excel</DropdownItem>
						</DropdownMenu>
					</DownloadContainer>
				</ExpenseBodyHeader>
			</ExpenseHeader>
			<EnhancedTable
				clients={filteredRows}
				handleAddInvoice={handleAddInvoice}
				onEditClient={handleEditClient}
			/>
			<AddClientModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				clientData={clientData}
				onSave={handleSaveClient}
				type={type}
			/>
			<CreateInvoiceModal
				isOpen={isInvoiceModalOpen}
				onRequestClose={handleInvoiceCloseModal}
			/>
		</div>
	);
};

export default ClientCard;
