import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styled from "styled-components";
import GreenDot from "../../assets/images/green-dot.svg";
import RedDot from "../../assets/images/red-dot.svg";
import GreyDot from "../../assets/images/grey-dot.svg";
import Plus from "../../assets/images/add-line.svg";
import axios from "axios";
import ViewClientModal from "../modal/ViewClientModal";
import {useState} from "react";
import {useAuth} from "../../store/auth/AuthContext";
import DeleteModal from "../modal/DeleteModal";
import ResponseModal from "../modal/ResponseModal";

function createData(id, name, title, total, contact, icon, status) {
	return {
		id,
		name,
		title,
		contact,
		total,
		icon,
		status
	};
}

const rows = [
	createData("001", 'ABC Corp', "Website Design", 2500, "abc@email.com", "", "Active"),
	createData("002", 'Delta Designs', "Branding Package", 3500, "jake@deltadesigns.com", "", "Active"),
	// Add more rows as needed
];

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{ id: 'id', numeric: false, disablePadding: false, label: 'Client ID' },
	{ id: 'name', numeric: false, disablePadding: true, label: 'Client Name' },
	{ id: 'title', numeric: false, disablePadding: true, label: 'Client Email' },
	{ id: 'contact', numeric: false, disablePadding: true, label: 'Client Phone' },
	{ id: 'due', numeric: true, disablePadding: true, label: 'Amount Paid (N)' },
	{ id: 'total', numeric: true, disablePadding: true, label: 'Amount Due (N)' },

	{ id: 'status', numeric: false, disablePadding: true, label: 'Status' },
	{ id: 'icon', numeric: false, disablePadding: true, label: '' },
];

function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'left'}
						padding={headCell.disablePadding ? 'none' : '16px'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

export const Button = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 16px;
    gap: 8px;
    height: 44px;
    font-weight: 500;
    font-size: 16px;
    transition: all 0.3s ease-in;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #0D0D12;
    background: #FFFFFF;
    box-shadow: 0px 0px 1px 1px rgba(129, 136, 152, 0.1), inset 0px 0px 0px 1px #C1C7D0;
    border-radius: 12px;
    &:hover {
        background: rgba(129, 136, 152, 0.1);
    }
`;

function EnhancedTableToolbar(props) {
	const { numSelected } = props;

	return (
		<></>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const ContactText = styled.span`
    color: rgb(44,152,245);
    font-weight: 500;
`;

const StatusText = styled.span`
/* Styles=Fill, Size=Medium, Type=Dot, Colors=Green */
/* Auto layout */
display: flex;
width: fit-content;
	text-transform: capitalize;
flex-direction: row;
align-items: center;
padding: 2px 10px 2px 8px;
gap: 4px;
background: #ECF9F7;
border-radius: 16px;
font-weight: 500;
font-size: 14px;
line-height: 20px;
/* identical to box height, or 143% */
text-align: center;
letter-spacing: 0.01em;
color: #267666;

`

// Create your data and helper functions...

const GreyStatusText = styled(StatusText)`
background: #ECEFF3;
color: #0D0D12;
`

const RedStatusText = styled(StatusText)`
background: #FCE8EC;
color: #B21634;
`

const StatusDot = styled.img`
    width: 8px;
    height: 8px;
`;

export default function EnhancedTable({clients, handleAddInvoice, onEditClient}) {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('name');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [viewModal, setViewModal] = useState(false);
	const [selectedClient, setSelectedClient] = useState({})
	const [anchorEls, setAnchorEls] = useState({});
	const {userDetails} = useAuth();
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isResponseModalOpen, setResponseModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [modalType, setModalType] = useState('success');
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	const handleClick = (event, index) => {
		setAnchorEls({ ...anchorEls, [index]: event.currentTarget });
	};

	// Handle closing the menu
	const handleClose = (index) => {
		setAnchorEls({ ...anchorEls, [index]: null });
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};
	const handleDeleteClick = (item) => {
		setSelectedItem(item);
		setDeleteModalOpen(true);
	};
	const handleDeleteConfirm = async (data) => {
		setDeleteLoading(true);
		try {
			const response = await axios.post(`https://tax-app-backend.onrender.com/api/clients/delete/${data._id}`, {id: data._id});
			if (response.data.responseCode === "00"){
				setModalMessage('Item deleted successfully');
				setModalType('success');
			}
			else {
				setModalMessage(response.data.responseMessage);
				setModalType('error');
			}
			console.log(response)
			axios.get(`https://tax-app-backend.onrender.com/api/clients/clients/`, {});

		} catch (error) {
			if (error.response) {
				if (error.response.data.responseMessage.includes("authorized")){
					setModalMessage("You are not authorised to delete clients.");
				}
				else setModalMessage(error.response.data.responseMessage)
				setModalType('error');
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
		finally {
			setDeleteLoading(false);
		}
		setDeleteModalOpen(false);
		setResponseModalOpen(true);
		// Perform the deletion action here, like making an API call to delete the item.
	};
	const handleMenuClick = async (action, data, index) => {
		console.log(data)
		// Handle menu actions here
		handleClose(index);
		if (action === "delete"){
			handleDeleteClick(data)
		}
		else if (action === "edit") {
			onEditClient(data)
		}
		else if (action === "view"){
			setSelectedClient(data)
			setViewModal(true)
		}
		else {
			handleAddInvoice();
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const filteredRows = stableSort(rows, getComparator(order, orderBy)).slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<Box sx={{ width: '100%', minHeight: 650 }} className="pl-2 pr-2">
			<Paper sx={{ width: '100%', mb: 2}}>
				<EnhancedTableToolbar numSelected={selected.length} />
				<TableContainer>
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby="tableTitle"
						size={dense ? 'small' : 'medium'}
					>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							onSelectAllClick={handleSelectAllClick}
							rowCount={rows.length}
						/>
						<TableBody>
							{clients.map((row, index) => {
								const isItemSelected = isSelected(row.name);
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.id}
										selected={isItemSelected}
									>
										<TableCell component="th" id={labelId} scope="row" padding="16px">
											{String(index + 1).padStart(3, '0')}
										</TableCell>
										<TableCell align="left" padding="none">{row.name}</TableCell>
										<TableCell align="left" padding="none">{row.email}</TableCell>
										<TableCell align="left" padding="none"><ContactText>{row.phone}</ContactText></TableCell>
										<TableCell align="left" padding="none">{row.clientAmountPaid || 0}</TableCell>
										<TableCell align="left" padding="none">{row.clientAmountDue}</TableCell>
										<TableCell align="left" padding="none">
											{row.status === "active" ? <StatusText><img src={GreenDot} alt="Green Dot"/><span>{row.status}</span></StatusText> : row.status === "inactive" ? <RedStatusText><img src={RedDot} alt="Red Dot"/><span>{row.status}</span></RedStatusText> : <GreyStatusText><img src={GreyDot} alt="Grey Dot"/><span>{row.status || "Pending"}</span></GreyStatusText>}
										</TableCell>
										<TableCell padding="checkbox">
											<IconButton onClick={(event) => handleClick(event, index)}>
												<MoreVertIcon />
											</IconButton>
											<Menu
												anchorEl={anchorEls[index]}
												open={Boolean(anchorEls[index])}
												onClose={() => handleClose(index)}
												sx={{
													'& .MuiPaper-root': {
														marginLeft: '-30px' // Adjust the value as needed
													},
													'& ul': {
														padding: "0"
													}

												}}
											>
												<div className="w-40 left-2">
													<MenuItem sx={{
														fontSize: "14px",
														fontWeight: "500"
													}} onClick={() => handleMenuClick('create', row, index)}>Create Invoice</MenuItem>
													<MenuItem sx={{
														fontSize: "14px",
														fontWeight: "500"
													}} onClick={() => handleMenuClick('view', row, index)}>View</MenuItem>
													{
														(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("edit-client")) && <MenuItem sx={{
															fontSize: "14px",
															fontWeight: "500"
														}} onClick={() => handleMenuClick('edit', row, index)}>Edit</MenuItem>
													}
													{
														(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("delete-client")) && <MenuItem sx={{
															fontSize: "14px",
															fontWeight: "500"
														}} onClick={() => handleMenuClick('delete', row, index)}>Delete</MenuItem>
													}

												</div>
											</Menu>

										</TableCell>
									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: (dense ? 33 : 53) * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
				<ViewClientModal
					isOpen={viewModal}
					onClose={() => setSelectedClient(null)}
					client={selectedClient}
				/>
				<DeleteModal
					isOpen={isDeleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onDelete={handleDeleteConfirm}
					itemName={selectedItem ? selectedItem : ''}
					loading={deleteLoading}
				/>
				<ResponseModal
					isOpen={isResponseModalOpen}
					onClose={() => setResponseModalOpen(false)}
					message={modalMessage}
					type={modalType}
					autoClose={true} // Optional: Disable if you want manual close only
					autoCloseTime={3000} // Optional: Adjust the time it stays open
				/>
			</Paper>
		</Box>
	);
}
