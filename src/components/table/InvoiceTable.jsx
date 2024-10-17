import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import GreenDot from "../../assets/images/green-dot.svg"
import RedDot from "../../assets/images/red-dot.svg"
import GreyDot from "../../assets/images/grey-dot.svg"
import styled from "styled-components";
import {useContext, useState} from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InvoiceDetailsModal from "../modal/InvoiceDetailsModal";
import axios from "axios";
import {DataContext} from "../../context/DataContext";
import {useAuth} from "../../store/auth/AuthContext";

const headCells = [
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'Invoice No.',
	},
	{
		id: 'ref',
		numeric: true,
		disablePadding: false,
		label: 'Ref. No.',
	},
	{
		id: 'name',
		numeric: true,
		disablePadding: false,
		label: 'Client',
	},
	{
		id: 'trandate',
		numeric: true,
		disablePadding: false,
		label: 'Transaction Date',
	},
	{
		id: 'paid',
		numeric: true,
		disablePadding: false,
		label: 'Amount Paid (₦)',
	},
	{
		id: 'dueamount',
		numeric: true,
		disablePadding: false,
		label: 'Amount Due (₦)',
	},
	{
		id: 'status',
		numeric: true,
		disablePadding: false,
		label: 'Status',
	},
	{
		id: 'actions',
		numeric: false,
		disablePadding: false,
		label: '',
	},
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

function EnhancedTableHead(props) {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align="left"
						padding={headCell.disablePadding ? '16px' : 'normal'}
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
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
};

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 16px;
  height: 52px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #0D0D12;
  background: #FFFFFF;
  box-shadow: 0px 0px 1px 1px rgba(129, 136, 152, 0.1), inset 0px 0px 0px 1px #C1C7D0;
  border-radius: 12px;
  transition: all 0.3s ease-in;
  &:hover {
    background: rgba(129, 136, 152, 0.1);
  }
`;

const StatusText = styled.span`
  display: flex;
  width: fit-content;
  align-items: center;
  padding: 2px 10px 2px 8px;
  background: #ECF9F7;
  border-radius: 16px;
  font-weight: 500;
  font-size: 14px;
    gap: 4px;
  line-height: 20px;
  text-align: center;
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

function EnhancedTableToolbar({ searchQuery, setSearchQuery, onDownload }) {
	return (
		<></>
	);
}

export default function InvoiceTable({ invoices, handleEdit, changeViewMode }) {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('id');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [searchQuery, setSearchQuery] = React.useState('');;
	const {setInvoices} = useContext(DataContext);
	const {userDetails} = useAuth();

	const [openModal, setOpenModal] = useState(false)
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleDownload = () => {
		const csvRows = [
			['Invoice No.', 'Ref. No.', 'Client', 'Transaction Date', 'Amount Paid', 'Amount Due', 'Status'],
			...invoices.map(invoice => [
				invoice.invoiceNo,
				invoice.referenceNumber,
				invoice.companyName,
				invoice.trandate,
				invoice.amountPaid,
				invoice.amountDue,
				invoice.status
			])
		];
		const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'invoices.csv');
		document.body.appendChild(link);
		link.click();
	};

	const filteredRows = invoices.filter(
		(invoice) =>
			(invoice._id && invoice._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(invoice.ref && invoice.ref.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(invoice.name && invoice.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(invoice.trandate && invoice.trandate.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(invoice.paid && invoice.paid.toString().includes(searchQuery)) ||
			(invoice.dueamount && invoice.dueamount.toString().includes(searchQuery)) ||
			(invoice.status && invoice.status.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const visibleRows = React.useMemo(
		() =>
			stableSort(filteredRows, getComparator(order, orderBy)).slice(
				page * rowsPerPage,
				page * rowsPerPage + rowsPerPage
			),
		[order, orderBy, page, rowsPerPage, filteredRows]
	);
	function formatDate(dateString) {
		const date = new Date(dateString);
		const formatter = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
		return formatter.format(date);
	}
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedInvoice, setSelectedInvoice] = React.useState({_id: ""});

	const handleMenuClick = (event, row) => {
		setAnchorEl(event.currentTarget);
		setSelectedInvoice(row);
		console.log(row)
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleModalClose = () => {
		setOpenModal(false)
	}

	const handleView = (invoice) => {
		changeViewMode(true)
		setSelectedInvoice(invoice);
		handleMenuClose();
		handleEdit(invoice)
		// setOpenModal(true);
	};

	const handleDelete = async (invoice) => {

		// Implement delete logic here
		try {
			await axios.post(`https://tax-app-backend.onrender.com/api/invoices/delete/${selectedInvoice._id}`, {id: selectedInvoice._id});
			const response = await axios.get("https://tax-app-backend.onrender.com/api/invoices/spoolInvoices", {});
			console.log(response.data);

			setInvoices(response.data.responseData)
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
		handleMenuClose();
	};

	const {clients} = useContext(DataContext);
	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<EnhancedTableToolbar
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					onDownload={handleDownload}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
						<EnhancedTableHead
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={filteredRows.length}
						/>
						<TableBody>
							{visibleRows.map((row, index) => {
								return (
									<TableRow
										hover
										tabIndex={-1}
										key={row._id}
									>
										<TableCell align="left" onClick={() => handleView(row)}>{row.invoiceNo}</TableCell>
										<TableCell align="left" onClick={() => handleView(row)}>{row.referenceNumber}</TableCell>
										<TableCell align="left">{clients.length > 0 && clients.find(c => c._id === row.clientId)  ? clients.find(c => c._id === row.clientId).name : <span className="text-red-600">Deleted Client</span> }</TableCell>
										<TableCell align="left">{ row.transactionDate && formatDate(row.transactionDate) || row.createdAt && formatDate(row.createdAt)  || row.timestamps}</TableCell>
										<TableCell align="left">{row.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
										<TableCell align="left">{row.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
										<TableCell align="left">
											{row.status === 'Paid' && <StatusText><img src={GreenDot} alt="Green Dot"/>Paid</StatusText>}
											{row.status === 'Pending' && <GreyStatusText><img src={GreyDot} alt="Grey Dot"/>Pending</GreyStatusText>}
											{row.status === 'Overdue' && <RedStatusText><img src={RedDot} alt="Red Doot"/>Overdue</RedStatusText>}
											{row.status === 'Canceled' && <RedStatusText><img src={RedDot} alt="Red Doot"/>Canceled</RedStatusText>}

										</TableCell>
										<TableCell align="left">
											{/* Actions Menu Button */}
											<IconButton onClick={(e) => handleMenuClick(e, row)}>
												<MoreVertIcon />
											</IconButton>
											<Menu
												id="actions-menu"
												anchorEl={anchorEl}
												open={Boolean(anchorEl)}
												onClose={handleMenuClose}
											>
												<MenuItem onClick={() => handleView(row)}>View</MenuItem>
												{
													(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("edit-invoice")) && <MenuItem onClick={() => {handleMenuClose(); handleEdit(row)}}>Edit</MenuItem>
												}
												{
													(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("delete-invoice")) && <MenuItem onClick={() => handleDelete(row)}>Delete</MenuItem>
												}
												<MenuItem onClick={() => handleDownload(row)}>Download</MenuItem>
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
							{rowsPerPage - visibleRows.length > 0 && (
								<TableRow
									style={{
										height: 53 * (rowsPerPage - visibleRows.length),
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 50]}
					component="div"
					count={filteredRows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<InvoiceDetailsModal isOpen={openModal} onClose={handleModalClose} invoiceId={selectedInvoice._id}/>
		</Box>
	);
}

InvoiceTable.propTypes = {
	invoices: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			ref: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			trandate: PropTypes.string.isRequired,
			paid: PropTypes.number.isRequired,
			dueamount: PropTypes.number.isRequired,
			status: PropTypes.oneOf(['Paid', 'Pending', 'Overdue']).isRequired,
		})
	).isRequired,
};
