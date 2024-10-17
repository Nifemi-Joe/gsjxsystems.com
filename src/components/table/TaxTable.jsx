import React, {useState, useEffect, useMemo, useContext} from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	TablePagination,
	Checkbox
} from '@mui/material';
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
import {DataContext} from "../../context/DataContext";
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
const TaxTable = ({taxs, onEdit, onDelete, onToggleStatus, onPay, clientName}) => {
	const [page, setPage] = useState(0);
	const [anchorEl, setAnchorEl] = useState(null);
	const {clients} = useContext(DataContext)
	const [selectedTaxes, setSelectedTaxes] = useState([]);
	const [filter, setFilter] = useState('all');
	const [rowsPerPage, setRowsPerPage] = useState(10);
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
	const handleSelectTax = (taxId) => {
		setSelectedTaxes((prev) => {
			if (prev.includes(taxId)) {
				return prev.filter((id) => id !== taxId);
			} else {
				return [...prev, taxId];
			}
		});
	};

	const handleSelectAll = (event) => {
		if (event.target.checked) {
			setSelectedTaxes(taxs.map((tax) => tax._id));
		} else {
			setSelectedTaxes([]);
		}
	};
	function formatDate(dateString) {
		const date = new Date(dateString);
		const formatter = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
		return formatter.format(date);
	}
	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	const filteredTaxes = useMemo(() => {
		return taxs.filter((tax) => {
			if (filter === 'paid') {
				return tax.status === 'paid';
			}
			if (filter === 'unpaid') {
				return tax.status === 'unpaid';
			}
			if (filter === 'overdue') {
				// Assume we have a way to calculate overdue status
				return new Date(tax.dueDate) < new Date();
			}
			return true;
		});
	}, [filter, taxs]);
	const getClientName = (clientId) => {
		const client = clients.find(c => c._id === clientId);
		return client ? client.name : 'Unknown Client';
	};

	return (
		<Paper>
			<div style={{padding: '16px'}}>
				<label>
					Filter by status:
					<select value={filter} onChange={handleFilterChange}>
						<option value="all">All</option>
						<option value="paid">Paid</option>
						<option value="unpaid">Unpaid</option>
						<option value="overdue">Overdue</option>
					</select>
				</label>
				<Button onClick={() => onPay(selectedTaxes)} disabled={selectedTaxes.length === 0}>
					Pay Selected
				</Button>
			</div>

			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									indeterminate={selectedTaxes.length > 0 && selectedTaxes.length < taxs.length}
									checked={selectedTaxes.length === taxs.length}
									onChange={handleSelectAll}
								/>
							</TableCell>
							<TableCell>Invoice No</TableCell>
							<TableCell>Client</TableCell>
							<TableCell>Tax Type</TableCell>
							<TableCell>Total Amount</TableCell>
							<TableCell>Tax Rate</TableCell>
							<TableCell>Amount Deducted</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Status</TableCell>

						</TableRow>
					</TableHead>
					<TableBody>
						{taxs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tax) => (
							<TableRow key={tax.id}>
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedTaxes.includes(tax._id)}
										onChange={() => handleSelectTax(tax._id)}
									/>
								</TableCell>
								<TableCell>{tax.invoiceNo}</TableCell>
								<TableCell>{!tax.clientId ? clientName(tax) : "--"}</TableCell> {/* Display client name */}
								<TableCell>{tax.taxType}</TableCell>
								<TableCell>{tax.totalAmount}</TableCell>
								<TableCell>{tax.taxRate}</TableCell>
								<TableCell>{tax.taxAmountDeducted}</TableCell>
								<TableCell>{formatDate(tax.date)}</TableCell>
								<TableCell>{tax.status.toLowerCase() === "paid" ? <StatusText><img src={GreenDot}
								                                                                   alt="Green Dot"/><span>{tax.status}</span></StatusText> : tax.status.toLowerCase() === "unpaid" ?
									<RedStatusText><img src={RedDot}
									                    alt="Red Doot"/><span>{tax.status}</span></RedStatusText> :
									<GreyStatusText><img src={GreyDot}
									                     alt="Grey Dot"/><span>{tax.status}</span></GreyStatusText>}</TableCell>
								{/*<TableCell>*/}
								{/*	<IconButton onClick={handleMenuClick}>*/}
								{/*		<MoreVertIcon />*/}
								{/*	</IconButton>*/}
								{/*	<Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>*/}
								{/*		<MenuItem onClick={() => { onEdit(tax); handleMenuClose(); }}>*/}
								{/*			<ListItemIcon>*/}
								{/*				<EditIcon fontSize="small" />*/}
								{/*			</ListItemIcon>*/}
								{/*			<ListItemText>Edit</ListItemText>*/}
								{/*		</MenuItem>*/}
								{/*		<MenuItem onClick={() => { onDelete(tax); handleMenuClose(); }}>*/}
								{/*			<ListItemIcon>*/}
								{/*				<DeleteIcon fontSize="small" />*/}
								{/*			</ListItemIcon>*/}
								{/*			<ListItemText>Delete</ListItemText>*/}
								{/*		</MenuItem>*/}
								{/*		<MenuItem onClick={() => { onToggleStatus(tax); handleMenuClose(); }}>*/}
								{/*			<ListItemIcon>*/}
								{/*				{tax.status === "active" ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />}*/}
								{/*			</ListItemIcon>*/}
								{/*			<ListItemText>*/}
								{/*				{tax.status === "active" ? "Mark as Inactive" : "Mark as Active"}*/}
								{/*			</ListItemText>*/}
								{/*		</MenuItem>*/}
								{/*	</Menu>*/}
								{/*</TableCell>*/}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 50]}
				component="div"
				count={taxs.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};

export default TaxTable;
