import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
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

const UserTable = ({users, onEdit, onDelete, onToggleStatus}) => {
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

	return (
		<Paper>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Firstname</TableCell>
							<TableCell>Middlename</TableCell>
							<TableCell>Surname</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.firstname || user.name || "--"}</TableCell>
								<TableCell>{user.middlename || "--"}</TableCell>
								<TableCell>{user.surname || "--"}</TableCell>
								<TableCell>{user.email || "--"}</TableCell>
								<TableCell>{user.role || "--"}</TableCell>
								<TableCell>{user.status.toLowerCase() === "active" ? <StatusText><img src={GreenDot} alt="Green Dot"/><span>{user.status}</span></StatusText> : user.status.toLowerCase() === "inactive" ? <RedStatusText><img src={RedDot} alt="Red Dot"/><span>{user.status}</span></RedStatusText> : <GreyStatusText><img src={GreyDot} alt="Grey Dot"/><span>{user.status}</span></GreyStatusText>}</TableCell>
								<TableCell>
									<div className="relative">
										<IconButton onClick={handleMenuClick}>
											<MoreVertIcon />
										</IconButton>
										<Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} sx={{boxShadow: "none", '& .MuiPaper-root': {
												boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
											}, left: "-40px", border: "none"}}>
											<MenuItem onClick={() => { onEdit(user); handleMenuClose(); }}>
												<ListItemIcon>
													<EditIcon fontSize="small" />
												</ListItemIcon>
												<ListItemText>Edit</ListItemText>
											</MenuItem>
											<MenuItem onClick={() => { onDelete(user); handleMenuClose(); }}>
												<ListItemIcon>
													<DeleteIcon fontSize="small" />
												</ListItemIcon>
												<ListItemText>Delete</ListItemText>
											</MenuItem>
											<MenuItem onClick={() => { onToggleStatus(user); handleMenuClose(); }}>
												<ListItemIcon>
													{user.status === "active" ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
												</ListItemIcon>
												<ListItemText>
													{user.status === "active" ? "Mark as Inactive" : "Mark as Active"}
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
				count={users.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default UserTable;
