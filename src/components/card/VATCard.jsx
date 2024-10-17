// components/VATCard.js

import React, {useState, useEffect, useMemo, useContext} from "react";
import axios from "axios";
import styled from "styled-components";
import VATTable from "../table/VATTable"; // Ensure the path is correct and VATTable is a default export
import CreateVATModal from "../modal/CreateVATModal"; // Ensure the path is correct and CreateVATModal is a default export
import { FaPlus, FaSearch, FaDownload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import Add from "../../assets/images/add-line-grey.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import CancelIcon from "../../assets/images/close-icon.svg";
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
import {DataContext} from "../../context/DataContext";
const VATCard = () => {
	const {vat, setVat} = useContext(DataContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredVats, setFilteredVats] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added state for dropdown
	//
	// useEffect(() => {
	// 	fetchVats();
	// }, []);

	useEffect(() => {
		handleSearch();
	}, [searchQuery, vat]);

	// const fetchVats = async () => {
	// 	try {
	// 		const response = await axios.get('https://tax-app-backend.onrender.com/api/vat'); // Ensure the base URL is correct
	// 		setVats(response.data.responseData);
	// 	} catch (error) {
	// 		console.error('Error fetching VAT rates:', error);
	// 		// Optionally, handle error (e.g., show a notification)
	// 	}
	// };

	const handleSearch = () => {
		if (searchQuery.trim() === "") {
			setFilteredVats(vat);
		} else {
			const lowercasedQuery = searchQuery.toLowerCase();
			const filtered = vat.filter(vats =>
				vats.value.toLowerCase().includes(lowercasedQuery) ||
				vats.status.toString().includes(lowercasedQuery) ||
				new Date(vats.createdAt).toLocaleDateString().includes(lowercasedQuery)
			);
			setFilteredVats(filtered);
		}
	};

	const handleAddVAT = (newVAT) => {
		setVat([newVAT, ...vat]); // Add the new VAT at the beginning
	};

	const handleDeleteVAT = async (id) => {
		try {
			await axios.delete(`https://tax-app-backend.onrender.com/api/vat/${id}`); // Ensure the base URL is correct
			setVat(vat.filter(vat => vat._id !== id));
		} catch (error) {
			console.error('Error deleting VAT rate:', error);
			// Optionally, handle error (e.g., show a notification)
		}
	};

	const csvData = vat.map((vat) => ({
		"VAT": vat.value,
		"Status": vat.status,
		"Created At": new Date(vat.createdAt).toLocaleDateString(),
	}));

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "VAT Rates");
		XLSX.writeFile(workbook, "VAT_Rates.xlsx");
	};

	if (vat.length === 0) {
		return (
			<LoadingWrapper>
				<Image src={require("../../assets/images/database.png")} alt="No VAT" />
				<LoadingText>No VAT Rates Available</LoadingText>
				<Button onClick={() => setIsModalOpen(true)}>Add VAT</Button>
				<CreateVATModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onAdd={handleAddVAT}
				/>
			</LoadingWrapper>
		);
	}

	return (
		<Container>
			<Header>
				<h2>VAT Rates</h2>
				<div className="actions w-3/4">
					<SearchInput
						type="text"
						placeholder="Search VAT..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<AddContainer onClick={() => setIsModalOpen(true)}>
						<img src={Add} alt="Add"/>
					</AddContainer>
					<DownloadContainer>
						<DownloadButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
							<img src={isDropdownOpen ? CancelIcon : ArrowDown} alt="Download"/>
						</DownloadButton>
						{isDropdownOpen && (
							<DropdownMenu>
								<CSVLink data={csvData} filename={"VAT_Rates.csv"}>
									<DropdownItem>Download as CSV</DropdownItem>
								</CSVLink>
								<DropdownItem onClick={exportToExcel}>Download as Excel</DropdownItem>
							</DropdownMenu>
						)}
					</DownloadContainer>
				</div>
			</Header>

			<CurrentVAT>
				<h3>Current VAT Rate: {vat.length > 0 ? `${vat[0].value}%` : 'N/A'}</h3>
			</CurrentVAT>

			<VATTable vats={filteredVats.length > 0 ? filteredVats : vat} onDelete={handleDeleteVAT} onEdit={() => { /* Implement edit functionality */ }} />

			{isModalOpen && (
				<CreateVATModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onAdd={handleAddVAT}
				/>
			)}
		</Container>
	);
};

export default VATCard;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  gap: 10px;
	align-items: center;
	justify-content: space-between;
  margin-bottom: 20px;

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;



const CurrentVAT = styled.div`
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
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
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

