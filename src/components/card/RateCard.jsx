import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { Header, HeaderLeft, HeaderRight } from "./DashboardCard";
import Search from "../../assets/images/search-line.svg";
import Calendar from "../../assets/images/calendar-todo-line.svg";
import Add from "../../assets/images/add-line-grey.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import CancelIcon from "../../assets/images/close-icon.svg";
import Database from "../../assets/images/database.png"
import {
	AddContainer,
	DateContainer,
	DateInput,
	DownloadButton,
	DownloadContainer,
	DropdownItem,
	DropdownMenu, ExpenseBodyHeader, ExpenseHeader,
	SearchInput,
} from "./ExpenseCard";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { DataContext } from "../../context/DataContext";
import CreateRateModal from "../modal/CreateRateModal";
import styled from "styled-components";
import ChevronDown from "../../assets/images/arrow-down-s-line.svg";
import RateTable from "../table/RateTable";
import DatePicker from "react-datepicker"; // Importing DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Importing DatePicker styles
import { FaCalendarAlt } from "react-icons/fa"; //

const LoadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fc;
    text-align: center;
`;

const LoadingText = styled.h2`
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin-bottom: 20px;
`;

const Image = styled.img`
    width: 100px;
    height: 100px;
    //animation: spin 2s linear infinite;
    //
    //@keyframes spin {
    //    0% { transform: rotate(0deg); }
    //    100% { transform: rotate(360deg); }
    //}
`;
const Button = styled.button`
    //margin-top: 10px;
    padding: 12px 24px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: #0056b3;
    }
`;
const RateCard = () => {
	const { rates = [], setRates } = useContext(DataContext);
	const [type, setType] = useState("add")// Default rates to an empty array
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	const csvData = rates.map((row) => ({
		Rate: row.value,
		Date: row.createdAt,
		Currency: row.currency,
		Status: row.status
	}));

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Rates");
		XLSX.writeFile(workbook, "Rates.xlsx");
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

	const handleAddRate = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const filteredRates = useMemo(() => {
		// Ensure startDate and endDate are valid Date objects
		const start = startDate instanceof Date ? startDate : new Date(startDate);
		const end = endDate instanceof Date ? endDate : new Date(endDate);
		console.log(start + " " + end)
		return rates.filter((row) => {
			if ((startDate && endDate) || searchQuery){
				const createdAtDate = new Date(row.createdAt); // Convert row's createdAt to a Date object

				// Check if the row matches the search query and falls within the date range
				return (
					(row.value.toString().includes(searchQuery) || row.createdAt.includes(searchQuery)) &&
					(createdAtDate.getTime() >= start.getTime() && createdAtDate.getTime() <= end.getTime())
				);
			}
			else {
				return rates
			}

		});
	}, [searchQuery, startDate, endDate, rates]);



	if (rates.length === 0) {
		return <LoadingWrapper>
			{/*<a href="https://www.flaticon.com/free-icons/full-storage" title="full storage icons"></a>*/}
			<Image src={Database} alt="Loading"/>
			<LoadingText>No Rates Available</LoadingText>
			<Button onClick={()=> setIsModalOpen(true)}>Add Rate</Button>
			<CreateRateModal isOpen={isModalOpen} onClose={handleCloseModal} rateData={rates} type={"add"}/>
		</LoadingWrapper>;
	}

	return (
		<div className="flex flex-col gap-4">
			<ExpenseHeader className="flex-row bg-white">
				<h3>Rates</h3>
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
					<AddContainer onClick={() => setIsModalOpen(true)}>
						<img src={Add} alt="Add"/>
					</AddContainer>
					<DownloadContainer>
						<DownloadButton isActive={isDropdownOpen}
						                onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
							<img src={isDropdownOpen ? CancelIcon : ArrowDown} alt="Download"/>
						</DownloadButton>
						<DropdownMenu isOpen={isDropdownOpen}>
							<CSVLink data={csvData} filename={"rates.csv"}>
								<DropdownItem>Download as CSV</DropdownItem>
							</CSVLink>
							<DropdownItem href="#" onClick={exportToExcel}>Download as Excel</DropdownItem>
						</DropdownMenu>
					</DownloadContainer>

				</ExpenseBodyHeader>
			</ExpenseHeader>
			<div className="p-6 flex flex-column g-3">
				<div className="flex justify-between mt-4">
					<div className="w-1/2">
						<h4>Current Rate: {rates.length > 0 && rates[rates.length - 1].value} USD/NGN</h4>
					</div>
				</div>
				<RateTable rates={filteredRates}/>
			</div>


			<CreateRateModal isOpen={isModalOpen} onClose={handleCloseModal} rateData={rates} type={type}/>
		</div>
	);
};

export default RateCard;
