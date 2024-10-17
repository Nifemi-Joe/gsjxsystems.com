import React, {useEffect, useState} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAuth} from "../../store/auth/AuthContext";

const RateTable = ({ rates, onEdit, onDelete }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedRate, setSelectedRate] = useState(null);
	const open = Boolean(anchorEl);
	const {userDetails} = useAuth()
	const handleMenuClick = (event, rate) => {
		setAnchorEl(event.currentTarget);
		setSelectedRate(rate);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedRate(null);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const formatID = (index) => {
		return String(index + 1).padStart(3, '0');
	};

	return (
		<Paper>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Rate</TableCell>
							<TableCell>Currency</TableCell>
							<TableCell>Creation Date</TableCell>
							{
								(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("edit-rate") || userDetails.permissions.includes("delete-rate")) && <TableCell  sx={{ width: '100px' }}>Actions</TableCell>
							}

						</TableRow>
					</TableHead>
					<TableBody>
						{rates
							.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by most recent createdAt
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Slice for pagination
							.map((rate, index) => (
								<TableRow key={rate.id}>
									<TableCell>{formatID(page * rowsPerPage + index)}</TableCell>
									<TableCell>{rate.value}</TableCell>
									<TableCell>{rate.currency}</TableCell>
									<TableCell>{new Date(rate.createdAt).toLocaleDateString()}</TableCell>
									{
										(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("delete-rate")) && 									<TableCell sx={{ width: '100px' }}>
											<div className="relative">
												<IconButton onClick={(event) => handleMenuClick(event, rate)}>
													<MoreVertIcon />
												</IconButton>
												<Menu
													anchorEl={anchorEl}
													open={open && selectedRate?.id === rate.id}
													onClose={handleMenuClose}
												>
													<MenuItem onClick={() => { onEdit(rate); handleMenuClose(); }}>
														<ListItemIcon>
															<EditIcon fontSize="small" />
														</ListItemIcon>
														<ListItemText>Edit</ListItemText>
													</MenuItem>
													<MenuItem onClick={() => { onDelete(rate); handleMenuClose(); }}>
														<ListItemIcon>
															<DeleteIcon fontSize="small" />
														</ListItemIcon>
														<ListItemText>Delete</ListItemText>
													</MenuItem>
												</Menu>
											</div>
										</TableCell>

									}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 50]}
				component="div"
				count={rates.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default RateTable;
