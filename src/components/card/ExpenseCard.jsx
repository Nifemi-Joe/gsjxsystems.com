import React, {useState, useMemo, useEffect, useContext} from "react";
import styled from "styled-components";
import Search from "../../assets/images/search-line.svg";
import Calendar from "../../assets/images/calendar-todo-line.svg";
import ChevronDown from "../../assets/images/arrow-down-s-line.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import Add from "../../assets/images/add-line-grey.svg";
import ExpenseTable from "../table/ExpenseTable";
import AddExpenseModal from "../modal/AddExpenseModal";
import CancelIcon from "../../assets/images/close-icon.svg";
import McDonalds from "../../assets/images/mcdonalds.jpg";
import Amazon from "../../assets/images/amazon.svg";
import Google from "../../assets/images/google.svg";
import Slack from "../../assets/images/slack.svg";
import * as XLSX from "xlsx";
import {CSVLink} from "react-csv";
import {Button} from "@mui/material";
import axios from "axios";
import {DataContext} from "../../context/DataContext"; // Assuming you have a cancel icon

export const ExpenseHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: rgb(246,246,244);
    border-radius: 30px 30px 0 0;
    padding: 16px;
    h3 {
        font-size: 28px;
        font-weight: 600;
    }
`;

const ExpenseContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const ExpenseContentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
        display: flex;
        flex-direction: column;
    }
    span {
        color: rgb(141,152,169);
    }
    h3 {
        color: rgb(31,31,31);
    }
    h5 {
        font-size: 26px;
        color: rgb(31,31,31);
        font-weight: 600;
    }
`;

const ProgressContainer = styled.div`
    display: flex;
    height: 4px;
    background: rgb(227,227,217);
    border-radius: 8px;
    width: 100%;
    position: relative;
    margin-top: 32px;
    border: 4px solid rgb(227,227,217);
`;

const ProgressBar = styled.div`
    position: absolute;
    top: -4px;
    left: -4px;
    height: 4px;
    background: rgb(89,176,137);
    border-radius: 8px;
    border: 4px solid rgb(89,176,137);
    width: ${(props) => (props.balancePaid/props.balance)/100 + "%" || "100%"};
	
`;

const ExpenseBody = styled.div`
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const ExpenseBodyHeader = styled.div`
    display: flex;
    gap: 16px;
    justify-content: end;
    margin-left: auto;
    width: 70%;
`;

export const SearchInput = styled.input`
    height: 44px;
    border: 1px solid rgb(237,237,237);
    padding: 10px 30px 10px 44px;
    border-radius: 30px;
    width: 100%;
`;

export const DateContainer = styled.label`
    //height: 44px;
    //border: 1px solid rgb(237,237,237);
    //color: rgb(167,176,189);
    //padding: 10px 10px 10px 10px;
    //border-radius: 30px;
    //display: flex;
    //width: 50%;
    //justify-content: space-between;
    //align-items: center;
    //cursor: pointer;
    //position: relative;
`;
export const DateInput = styled.input`
    top: 50px; /* Adjust position as needed */
    left: 0;
    width: 100%;
    height: 44px;
    border: 1px solid rgb(237,237,237);
    border-radius: 30px;
    padding: 10px;
    z-index: 10;
`;

export const DownloadContainer = styled.div`
    position: relative;
    display: inline-block;
`;

export const DownloadButton = styled.a`
    border: 1px solid ${({ isActive }) => (isActive ? "rgb(255,0,0)" : "rgb(60,135,105)")};
    padding: 8px 28px;
    display: flex;
	min-height: 40px;
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

export const DropdownMenu = styled.div`
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

export const DropdownItem = styled.a`
    padding: 8px 16px;
    display: block;
    color: rgb(31,31,31);
    text-decoration: none;
    &:hover {
        background-color: rgb(246,246,246);
    }
`;

export const AddContainer = styled.a`
    border: 1px solid rgb(75,56,215);
    padding: 8px 18px;
    display: flex;
    min-height: 40px;

    justify-content: center;
    align-items: center;
    border-radius: 30px;
    cursor: pointer;
`;

const Card = styled.div`
    background: rgb(246,246,244);
    padding: 16px 32px 32px 16px;
    border-radius: 16px;
    color: rgb(31,31,31);
    h3 {
        font-size: 28px;
        font-weight: 500;
        margin-top: 12px;
    }
    h6 {
        font-size: 16px;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const ModalContent = styled.div`
    background: white;
    padding: 24px;
    max-height: 80vh;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;


const StyledButton = styled(Button)`
    margin-right: 8px;
`;

const ExpenseCard = () => {
	function createData(id, date, name, to, by, image, reciept, amount, vat, tax) {
		return { id, date, name, to, by, image, reciept, amount, vat, tax };
	}

	const rows = [
		createData("001", "Monday, 12.06.2023", 'Num Pang', "Restaurants", "Tiffany Bennett", McDonalds, "", 1290.90, 1.5, 95.99),
		createData("002", "Monday, 12.06.2023", 'Amazon', "General Mechanics", "Cameron Wilson", Amazon, "#", 2999.99, 1.5, 109.99),
		createData("003", "Monday, 12.06.2023", 'Google G. Suite', "SaaS / Software", "Priscillia Williamson", Google, "", 569.10, 1.5, 10.99),
		createData("005", "Monday, 12.06.2023", 'Slack', "SaaS / Software", "Ricardo Mckinney", Slack, "#", 99.99, 1.5, 5.10),
		createData("006", "Monday, 12.06.2023", 'Num Pang', "Restaurants", "Tiffany Bennett", McDonalds, "", 1290.90, 1.5, 95.99),
		createData("007", "Monday, 12.06.2023", 'Amazon', "General Mechanics", "Cameron Wilson", Amazon, "#", 2999.99, 1.5, 109.99),
		createData("008", "Monday, 12.06.2023", 'Google G. Suite', "SaaS / Software", "Priscillia Williamson", Google, "", 569.10, 1.5, 10.99),
		createData("009", "Monday, 12.06.2023", 'Slack', "SaaS / Software", "Ricardo Mckinney", Slack, "#", 99.99, 1.5, 5.10),
	];
	const {invoices} = useContext(DataContext);
	const [currency, setCurrency] = useState('NGN');
	const [filter, setFilter] = useState('monthly');
	// const [expenses, setExpenses] = useState([]);
	const {expenses} = useContext(DataContext);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [startDate, setStartDate] = useState("2023-06-01");
	const [endDate, setEndDate] = useState("2023-06-30");
	const [searchQuery, setSearchQuery] = useState(""); // New state for search query
	const csvData = expenses.map(row => ({
		Category: row.category,
		Date: row.date,
		Receipt: row.reciept ? 'Yes' : 'No',
		Amount: row.amount,
		VAT: '7.5%',
		Tax: (row.amount - (7.5/100)),
		Description: row.description,

	}));

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
		XLSX.writeFile(workbook, "Expenses.xlsx");
	};
	// Handle search input change
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

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleDownloadClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};
	const fetchExpenses = async () => {
		try {
			const response = await axios.get('https://tax-app-backend.onrender.com/api/expenses/read', {});
			// setExpenses(response.data.responseData)
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
		fetchExpenses();
	}, []);
	const totalExpense = () => {
		let total = 0
		expenses.forEach((row)=> {
			total = total + row.amount
		})
		return total
	}
	const totalExpected = () => {
		let total = 0;
		invoices.forEach((invoice) => {
			if (invoice.status.toLowerCase() !== "canceled") {
				// Use the appropriate currency
				if (currency === 'USD') {
					total += invoice.totalInvoiceFee_usd;
				} else if (currency === 'NGN') {
					total += invoice.totalInvoiceFee_ngn;
				}
			}
		});
		return total;
	};
	const balance = (totalExpected() - totalExpense()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	const totalPaid = () => {
		let total = 0;
		invoices.forEach((invoice) => {
			if (invoice.status.toLowerCase() !== "paid") {
				// Use the appropriate currency
				if (currency === 'USD') {
					total += invoice.totalInvoiceFee_usd;
				} else if (currency === 'NGN') {
					total += invoice.totalInvoiceFee_ngn;
				}
			}
		});
		return total;
	};
	const balancePaid = (totalPaid() - totalExpense()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })


	// Calculate total expense based on filter and currency
	const totalExpensePerMonth = () => {
		let total = 0
		let todayMonth = new Date().getMonth()
		expenses.forEach((row)=> {
			if (new Date(row.date).getMonth() === todayMonth){
				total = total + row.amount
			}
		})
		return total
	}
	const filteredRows = useMemo(() => {
		return expenses.filter(row =>
			row.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			row.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
		row.date.toLowerCase().includes(searchQuery.toLowerCase())

	);
	}, [searchQuery, expenses]);

	return (
		<div>
			<ExpenseHeader>
				<h3>Overview</h3>
				<ExpenseContent>
					<ExpenseContentHeader>
						<div>
							<span>Current Balance</span>
							<h3>{currency === "USD" ? "$" : "₦"}{balancePaid}</h3>
						</div>
						<div className="items-end">
							<span>Available Balance</span>
							<h3>{currency === "USD" ? "$" : "₦"}{balance}</h3>
							{/*<span>$2,000,000</span>*/}
						</div>
					</ExpenseContentHeader>
					<ProgressContainer>
						<ProgressBar balance={balance} balancePaid={balancePaid}/>
					</ProgressContainer>
				</ExpenseContent>
			</ExpenseHeader>
			<ExpenseBody>
				<ExpenseBodyHeader>
					<div className="relative w-1/2">
						<SearchInput placeholder="Search & Filter"
						             value={searchQuery} // Set the value of the input to the search query
						             onChange={handleSearchChange}/>
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
					<AddContainer onClick={handleAddClick}>
						<img src={Add} alt="Add"/>
					</AddContainer>
					<DownloadContainer>
						<DownloadButton isActive={isDropdownOpen} onClick={handleDownloadClick}>
							{/*<img src={isDropdownOpen ? CancelIcon : ArrowDown} alt="Download" />*/}
						</DownloadButton>
						<DropdownMenu isOpen={isDropdownOpen}>
							<CSVLink data={csvData} filename={"expenses.csv"}>
								<DropdownItem>Download as CSV</DropdownItem>
							</CSVLink>
							<DropdownItem href="#" onClick={exportToExcel}>Download as Excel</DropdownItem>
						</DropdownMenu>
					</DownloadContainer>

				</ExpenseBodyHeader>
				<div className="flex gap-4 pt-3">
					<Card>
						<h6>Number of Expense</h6>
						<h3>{expenses.length}</h3>
					</Card>
					<Card>
						<h6>Total Expense</h6>
						<h3>₦{totalExpense()}</h3>
					</Card>
					<Card>
						<h6>Expense p/m</h6>
						<h3>₦{totalExpensePerMonth()}</h3>
					</Card>
				</div>
				<ExpenseTable rows={filteredRows}/>
			</ExpenseBody>
			{isModalOpen && (
				<ModalOverlay onClick={handleCloseModal}>
					<ModalContent onClick={(e) => e.stopPropagation()}>
						<AddExpenseModal isOpen={isModalOpen} onClose={handleCloseModal}/>
					</ModalContent>
				</ModalOverlay>
			)}
		</div>
	);
};

export default ExpenseCard;
