// src/components/company/CompanyTable.js

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, TablePagination } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GreenDot from "../../assets/images/green-dot.svg";
import RedDot from "../../assets/images/red-dot.svg";
import GreyDot from "../../assets/images/grey-dot.svg";
import styled from "styled-components";

const StatusText = styled.span`
  display: flex;
  width: fit-content;
  flex-direction: row;
  align-items: center;
  padding: 2px 10px 2px 8px;
  gap: 4px;
  background: #ECF9F7;
  text-transform: capitalize;
  border-radius: 16px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #267666;
`;

const GreyStatusText = styled(StatusText)`
  background: #ECEFF3;
  color: #0D0D12;
`;

const RedStatusText = styled(StatusText)`
  background: #FCE8EC;
  color: #B21634;
`;

const CompanyTable = ({ companies, onEdit, onDelete, onToggleStatus }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedCompany, setSelectedCompany] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuClick = (event, company) => {
		setAnchorEl(event.currentTarget);
		setSelectedCompany(company);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedCompany(null);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Paper>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Company Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Phone Number</TableCell>
							<TableCell>Address</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company) => (
							<TableRow key={company.id}>
								<TableCell>{company.name || "--"}</TableCell>
								<TableCell>{company.email || "--"}</TableCell>
								<TableCell>{company.phoneNumber || "--"}</TableCell>
								<TableCell>{company.address || "--"}</TableCell>
								<TableCell>
									{company.status.toLowerCase() === "active" ? (
										<StatusText>
											<img src={GreenDot} alt="Active" />
											<span>{company.status}</span>
										</StatusText>
									) : company.status.toLowerCase() === "inactive" ? (
										<RedStatusText>
											<img src={RedDot} alt="Inactive" />
											<span>{company.status}</span>
										</RedStatusText>
									) : (
										<GreyStatusText>
											<img src={GreyDot} alt="Pending" />
											<span>{company.status}</span>
										</GreyStatusText>
									)}
								</TableCell>
								<TableCell>
									<IconButton onClick={(event) => handleMenuClick(event, company)}>
										<MoreVertIcon />
									</IconButton>
									<Menu
										anchorEl={anchorEl}
										open={open && selectedCompany?.id === company.id}
										onClose={handleMenuClose}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										sx={{
											boxShadow: "none",
											'& .MuiPaper-root': {
												boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
											},
											marginTop: '10px',
										}}
									>
										<MenuItem onClick={() => { onEdit(company); handleMenuClose(); }}>
											<ListItemIcon>
												<EditIcon fontSize="small" />
											</ListItemIcon>
											<ListItemText>Edit</ListItemText>
										</MenuItem>
										<MenuItem onClick={() => { onDelete(company); handleMenuClose(); }}>
											<ListItemIcon>
												<DeleteIcon fontSize="small" />
											</ListItemIcon>
											<ListItemText>Delete</ListItemText>
										</MenuItem>
										<MenuItem onClick={() => { onToggleStatus(company); handleMenuClose(); }}>
											<ListItemIcon>
												{company.status.toLowerCase() === "active" ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
											</ListItemIcon>
											<ListItemText>
												{company.status.toLowerCase() === "active" ? "Mark as Inactive" : "Mark as Active"}
											</ListItemText>
										</MenuItem>
									</Menu>
								</TableCell>
							</TableRow>
						))}
						{companies.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} align="center">
									No companies found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 50]}
				component="div"
				count={companies.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default CompanyTable;
