import styled from "styled-components";
import Search from "../../assets/images/search-line.svg"
import {Button} from "../table/EnhancedTable";
import Plus from "../../assets/images/add-line.svg"
import {Container} from "./BalanceCard";
import Stack from "../../assets/images/stack-line.svg"
import Draft from "../../assets/images/draft-line.svg"
import Cash from "../../assets/images/exchange-dollar-line.svg"
import Hands from "../../assets/images/hand-coin-line.svg"
import InvoiceTable from "../table/InvoiceTable";
import EmployeeTable from "../table/EmployeeTable";
import Calendar from "../../assets/images/calendar-todo-line.svg";
import ChevronDown from "../../assets/images/arrow-down-s-line.svg";
import Add from "../../assets/images/add-line-grey.svg";
import {CSVLink} from "react-csv";
import React, {useContext, useEffect, useMemo, useState} from "react";
import CancelIcon from "../../assets/images/close-icon.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import * as XLSX from "xlsx";
import AddEmployeeModal from "../modal/AddEmployeeModal";
import axios from "axios";
import {DataContext} from "../../context/DataContext";
const RevenueContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 24px;
	gap: 48px;
`
const ContainerTop = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const ContainerTopLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    h3{
        font-weight: 600;
        font-size: 18px;
        color: rgb(25,25,29);
    }
    p{
        color: rgb(100,100,103);
    }
`

const ContainerTopRight = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    width: 50%;
    justify-content: end;
`
//
// const SearchInput = styled.input`
//     height: 52px;
//     width: 100%;
//     border-radius: 12px;
//     padding-left: 38px;
//     box-shadow: 0px 0px 1px 1px rgba(129, 136, 152, 0.1), inset 0px 0px 0px 1px #C1C7D0;;
//     outline: none;
// `

const PurpleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: rgb(250,247,254);
`

const YellowContainer = styled(PurpleContainer)`
    background: rgb(255,249,245);
`

const ExpenseBodyHeader = styled.div`
    display: flex;
    gap: 16px;
    justify-content: end;
    margin-left: auto;
    width: 100%;
`;

const SearchInput = styled.input`
    height: 44px;
    border: 1px solid rgb(237,237,237);
    padding: 10px 30px 10px 44px;
    border-radius: 30px;
    width: 100%;
`;


const DownloadContainer = styled.div`
    position: relative;
    display: inline-block;
`;

const DownloadButton = styled.a`
    border: 1px solid ${({ isActive }) => (isActive ? "rgb(255,0,0)" : "rgb(60,135,105)")};
    padding: 8px 28px;
    display: flex;
	transition: all 0.3s ease;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
	height: 100%;
    cursor: pointer;
	background-image: ${({ isActive }) => (isActive ? `url(${CancelIcon})` : `url(${ArrowDown})`)};
    // background-color: ${({ isActive }) => (isActive ? "rgb(255,0,0)" : "transparent")};
    color: ${({ isActive }) => (isActive ? "white" : "inherit")};
	background-repeat: no-repeat;
	background-position: 50%;
`;

const DropdownMenu = styled.div`
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    position: absolute;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
    width: 200px;
    top: 50px;
    left: -150px;
`;

const DropdownItem = styled.a`
    padding: 8px 16px;
    display: block;
    color: rgb(31,31,31);
    text-decoration: none;
    &:hover {
        background-color: rgb(246,246,246);
    }
`;

const AddContainer = styled.a`
    border: 1px solid rgb(75,56,215);
    padding: 8px 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    cursor: pointer;
`;

const GreenContainer = styled(PurpleContainer)`
    background: rgb(242,254,253);
`

const BlueContainer = styled(PurpleContainer)`
    background: rgb(247,243,255);
`

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    h5{
        font-size: 14px;
        font-weight: 500;
    }
    h2{
        font-size: 32px;
        font-weight: 600;
    }
`
const EmployeeCard = () => {
	const { employees } = useContext(DataContext);

	// const [employees, setEmployees] = useState([]);
	const csvData = employees.map(row => ({
		Firstname: row.firstname,
		Surname: row.surname,
		Middlename: row.middlename,
		PhoneNumber: row.phoneNumber,
		Salary: row.salary,
		DateOfJoining: row.dateOfJoining,
		Email: row.email,
		Department: row.department,
		Status: row.status,
		Position: row.position,
	}));

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
		XLSX.writeFile(workbook, "Employees.xlsx");
	};
	const [type, setType] = useState('add');
	const [selectedEmployee, setSelectedEmployee] = useState({});
	const [isModalOpen, setModalOpen] = useState(false);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [startDate, setStartDate] = useState("2023-06-01");
	const [endDate, setEndDate] = useState("2023-06-30");
	const [searchQuery, setSearchQuery] = useState(""); // New state for sea
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
	const handleDownloadClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};
	const handleEdit = (employee) => {
		setType('edit');
		setSelectedEmployee(employee)
		setModalOpen(true)
		// Logic for editing the employee
	};

	const handleDelete = (employee) => {
		console.log(employee)
		// setEmployees(employees.filter(e => e.id !== employee.id));
	};

	const handleToggleStatus = (employee) => {
		console.log(employee)

	};

	const fetchEmployees = async () => {
		try {
			const response = await axios.get('https://tax-app-backend.onrender.com/api/employees/read', {});

			// Process the data as needed
		} catch (error) {
			if (error.response) {
				// Server responded with a status other than 2xx
				console.error('Response Error:', error.response.data);
			} else if (error.request) {
				// No response received
				console.error('No Response:', error.request);
			} else {
				// Other errors
				console.error('Error Message:', error.message);
			}
		}
	};
	useEffect(() => {
		fetchEmployees();
	}, []);
	const filteredRows = useMemo(() => {
		return employees.filter(row =>
			row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.middlename.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.salary.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.dateOfJoining.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.updatedAt.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.position.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [searchQuery, employees]);
	const handleOpenModal = () => {
		setType('add')
		setModalOpen(true)
	};
	const handleCloseModal = () => setModalOpen(false);
	return(
		<RevenueContainer>
			<ContainerTop>
				<ContainerTopLeft>
					<h3>Employees</h3>
					<p>Add, review and approve employees</p>
				</ContainerTopLeft>
				<ContainerTopRight>
					<ExpenseBodyHeader>
						<div className="relative w-1/2">
							<SearchInput placeholder="Search & Filter" value={searchQuery} // Set the value of the input to the search query
							             onChange={handleSearchChange}/>
							<img src={Search} alt="Search" className="absolute top-2.5 left-3" />
						</div>
						<AddContainer onClick={handleOpenModal}>
							<img src={Add} alt="Add" />
						</AddContainer>
						<DownloadContainer>
							<DownloadButton isActive={isDropdownOpen} onClick={handleDownloadClick}>
								{/*<img src={isDropdownOpen ? CancelIcon : ArrowDown} alt="Download" />*/}
							</DownloadButton>
							<DropdownMenu isOpen={isDropdownOpen}>
								<CSVLink data={csvData} filename={"Employees.csv"}>
									<DropdownItem>Download as CSV</DropdownItem>
								</CSVLink>
								<DropdownItem href="#" onClick={exportToExcel}>Download as Excel</DropdownItem>
							</DropdownMenu>
						</DownloadContainer>

					</ExpenseBodyHeader>
				</ContainerTopRight>
			</ContainerTop>
			<div className="flex gap-3">
				<Container>
					<PurpleContainer>
						<img src={Stack} alt="Stack"/>
					</PurpleContainer>
					<TextContainer>
						<h3>Total Employees</h3>
						<h2>{employees.length || 0}</h2>
					</TextContainer>
				</Container>
				<Container>
					<YellowContainer>
						<img src={Draft} alt="Draft"/>
					</YellowContainer>
					<TextContainer>
						<h3>Active Employees</h3>
						<h2>{employees.filter((employee)=> employee.status.toLowerCase() === "active").length || 0}</h2>
					</TextContainer>
				</Container>
			</div>
			<EmployeeTable employees={filteredRows}   onEdit={handleEdit} type={type}
			               onDelete={handleDelete}
			               onToggleStatus={handleToggleStatus}/>
			<AddEmployeeModal isOpen={isModalOpen} onClose={handleCloseModal} type={type} employeeData={selectedEmployee}/>
		</RevenueContainer>
	)
}
export default EmployeeCard