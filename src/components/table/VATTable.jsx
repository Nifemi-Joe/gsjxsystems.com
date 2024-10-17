import React, { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText
} from '@mui/material';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAuth} from "../../store/auth/AuthContext";

const VATTable = ({ vats, onEdit, onDelete }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedVAT, setSelectedVAT] = useState(null);
	const open = Boolean(anchorEl);
	const {userDetails} = useAuth()
	const handleMenuClick = (event, vat) => {
		setAnchorEl(event.currentTarget);
		setSelectedVAT(vat);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedVAT(null);
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
							<TableCell>VAT</TableCell>

							<TableCell>Creation Date</TableCell>
							{
								(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("edit-vat") || userDetails.permissions.includes("delete-vat")) && <TableCell sx={{ width: '100px' }}>Actions</TableCell>
							}

						</TableRow>
					</TableHead>
					<TableBody>
						{vats
							.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by most recent createdAt
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Slice for pagination
							.map((vat, index) => (
								<TableRow key={vat.id}>
									<TableCell>{formatID(page * rowsPerPage + index)}</TableCell>
									<TableCell>{vat.value}</TableCell>
									<TableCell>{new Date(vat.createdAt).toLocaleDateString()}</TableCell>
									{
										(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("edit-vat") || userDetails.permissions.includes("delete-vat")) && <TableCell sx={{ width: '100px' }}>
											<div className="relative">
												<IconButton onClick={(event) => handleMenuClick(event, vat)}>
													<MoreVertIcon />
												</IconButton>
												<Menu
													anchorEl={anchorEl}
													open={open && selectedVAT?._id === vat._id}
													onClose={handleMenuClose}
												>
													<MenuItem onClick={() => { onEdit(vat); handleMenuClose(); }}>
														<ListItemIcon>
															<EditIcon fontSize="small" />
														</ListItemIcon>
														<ListItemText>Edit</ListItemText>
													</MenuItem>
													<MenuItem onClick={() => { onDelete(vat); handleMenuClose(); }}>
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
				count={vats.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default VATTable;
