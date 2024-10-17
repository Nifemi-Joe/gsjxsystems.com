import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import EmployeeFilters from '../shared/EmployeeFilters';
import EmployeeActions from '../shared/EmployeeActions';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import GreenDot from "../../assets/images/green-dot.svg";
import RedDot from "../../assets/images/red-dot.svg";
import GreyDot from "../../assets/images/grey-dot.svg";
import styled from "styled-components";
import {useAuth} from "../../store/auth/AuthContext";
const StatusText = styled.span`
    /* Styles=Fill, Size=Medium, Type=Dot, Colors=Green */
    /* Auto layout */
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
    /* identical to box height, or 143% */
    text-align: center;
    letter-spacing: 0.01em;
    color: #267666;
`

const GreyStatusText = styled(StatusText)`
	background: #ECEFF3;
	color: #0D0D12;
`

const RedStatusText = styled(StatusText)`
	background: #FCE8EC;
	color: #B21634;
`
const EmployeeTable = ({employees, onEdit, onDelete, onToggleStatus}) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};


	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const {userDetails} = useAuth();
	return (
		<Paper>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Firstname</TableCell>
							<TableCell>Middlename</TableCell>
							<TableCell>Surname</TableCell>
							<TableCell>Position</TableCell>
							<TableCell>Department</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
							<TableRow key={employee._id}>
								<TableCell>{employee.firstname || employee.name || "--"}</TableCell>
								<TableCell>{employee.middlename || "--"}</TableCell>
								<TableCell>{employee.surname || "--"}</TableCell>
								<TableCell>{employee.position || "--"}</TableCell>
								<TableCell>{employee.department || "--"}</TableCell>
								<TableCell>{employee.status.toLowerCase() === "active" ? <StatusText><img src={GreenDot} alt="Green Dot"/><span>{employee.status}</span></StatusText> : employee.status.toLowerCase() === "inactive" ? <RedStatusText><img src={RedDot} alt="Red Doot"/><span>{employee.status}</span></RedStatusText> : <GreyStatusText><img src={GreyDot} alt="Grey Dot"/><span>{employee.status}</span></GreyStatusText>}</TableCell>
								<TableCell>
									<div className="relative">
										<IconButton onClick={handleMenuClick}>
											<MoreVertIcon />
										</IconButton>
										<Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} sx={{boxShadow: "none", '& .MuiPaper-root': {
												boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
												// '--Paper-shadow': 'none', // Override the CSS variable for the shadow
											}, left: "-40px", border: "none"}}>
											{
												(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("edit-employee")) && <MenuItem onClick={() => { onEdit(employee); handleMenuClose(); }}>
													<ListItemIcon>
														<EditIcon fontSize="small" />
													</ListItemIcon>
													<ListItemText>Edit</ListItemText>
												</MenuItem>
											}
											{
												(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("delete-employee")) && <MenuItem onClick={() => { onDelete(employee); handleMenuClose(); }}>
													<ListItemIcon>
														<DeleteIcon fontSize="small" />
													</ListItemIcon>
													<ListItemText>Delete</ListItemText>
												</MenuItem>
											}

											<MenuItem onClick={() => { onToggleStatus(employee); handleMenuClose(); }}>
												<ListItemIcon>
													{employee.status === "active" ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
												</ListItemIcon>
												<ListItemText>
													{employee.status === "active" ? "Mark as Inactive" : "Mark as Active"}
												</ListItemText>
											</MenuItem>
										</Menu>
									</div>

								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 50]}
				component="div"
				count={employees.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default EmployeeTable;
