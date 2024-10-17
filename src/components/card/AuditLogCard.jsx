// src/pages/AuditLogPage.js

import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Search from "../../assets/images/search-line.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import AuditLogTable from "../table/AuditLogTable"; // Adjust the path as needed
import { DataContext } from "../../context/DataContext";
import {
	DownloadButton,
	DownloadContainer,
	DropdownItem,
	DropdownMenu, ExpenseBodyHeader, ExpenseHeader,
	SearchInput,
} from "./ExpenseCard";
const AuditLogHeader = styled.div`
    display: flex;
	justify-content: space-between;
    gap: 16px;
    border-radius: 30px 30px 0 0;
    padding: 16px;
    h3 {
        font-size: 28px;
        font-weight: 600;
    }
`;

const AuditLogContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const AuditLogBody = styled.div`
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const AuditLogCards = styled.div`
    padding: 16px 0px 32px 0;
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

const AuditLogCard = () => {
	const { auditLogs, setAuditLogs } = useContext(DataContext); // Assuming fetchAuditLogs is defined in DataContext
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredLogs, setFilteredLogs] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Prepare CSV Data
	const csvData = auditLogs.map(log => ({
		Action: log.action,
		User: log.userName,
		Module: log.module,
		Details: log.details,
		Date: log.timestamp,
		Status: log.status,
		IPAddress: log.ipAddress,
	}));
	const handleDownloadClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};
	useEffect(() => {
		if (searchQuery) {
			const filtered = auditLogs.filter(log =>
				log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
				log.details.toLowerCase().includes(searchQuery.toLowerCase())

			);
			setFilteredLogs(filtered);
		} else {
			setFilteredLogs(auditLogs);
		}
	}, [searchQuery, auditLogs]);

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "AuditLogs");
		XLSX.writeFile(workbook, "AuditLogs.xlsx");
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	return (
		<AuditLogContent>
			<AuditLogHeader>
				<h3>Audit Logs</h3>
				<div style={{display: "flex", justifyContent: "space-between", marginBottom: "16px", minWidth: "60%", gap: "16px", alignItems: "center"}}>
					<SearchInput
						type="text"
						placeholder="Search by Action or User..."
						aria-label="Search audit logs"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
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
				</div>

			</AuditLogHeader>

			<AuditLogBody>

				<AuditLogCards>
					<AuditLogTable rows={auditLogs}/>
				</AuditLogCards>
			</AuditLogBody>
		</AuditLogContent>
	);
};

export default AuditLogCard;
