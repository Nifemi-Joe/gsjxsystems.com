// src/components/table/AuditLogTable.js

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
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ImageContainer from '../../assets/images/background.avif';
import ViewAuditModal from "../modal/ViewAuditModal";
import { useState } from "react";

// Styled Components for Status Indicators
const StatusText = styled.span`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  color: #267666;
  background: #ecf9f7;
`;

// Sorting helper functions
function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) return -1;
	if (b[orderBy] > a[orderBy]) return 1;
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
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

// Define table headers
const headCells = [
	{ id: 'sn', numeric: false, disablePadding: true, label: 'S/N' },
	{ id: 'action', numeric: false, disablePadding: true, label: 'Action' },
	{ id: 'user', numeric: false, disablePadding: true, label: 'User' },
	{ id: 'date', numeric: false, disablePadding: true, label: 'Date' },
	{ id: 'status', numeric: true, disablePadding: false, label: 'Module' },
	{ id: 'ipAddress', numeric: true, disablePadding: false, label: 'IP Address' },
	{ id: 'actions', numeric: true, disablePadding: false, label: 'Actions' },
];

// Enhanced Table Head Component
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
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
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

// Main AuditLogTable Component
export default function AuditLogTable({ rows }) {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('date');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [anchorEls, setAnchorEls] = useState({});
	const [currentRow, setCurrentRow] = React.useState({});
	const [modalOpen, setModalOpen] = React.useState(false); // Modal state
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = rows.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleMenuClick = (event, index) => {
		setAnchorEls({ ...anchorEls, [index]: event.currentTarget });
	};

	const handleMenuClose = (index) => {
		setAnchorEls({ ...anchorEls, [index]: null });
	};

	const handleViewDetails = (row, index) => {
		console.log(modalOpen);
		setModalOpen( true);
		// Open the modal
		handleMenuClose(index);   // Close the menu immediately
		setCurrentRow(row);
	};

	const handleModalClose = () => setModalOpen(false); // Close the modal

	const visibleRows = React.useMemo(
		() =>
			stableSort(rows, getComparator(order, orderBy)).slice(
				page * rowsPerPage,
				page * rowsPerPage + rowsPerPage,
			),
		[rows, order, orderBy, page, rowsPerPage],
	);

	function formatDate(dateString) {
		const date = new Date(dateString);
		const formatter = new Intl.DateTimeFormat('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
		return formatter.format(date);
	}

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="auditLogTable" size={'medium'}>
						<EnhancedTableHead
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{visibleRows.map((row, index) => {
								const isItemSelected = selected.indexOf(row._id) !== -1;

								return (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={row._id}
										selected={isItemSelected}
									>
										<TableCell>{index + 1}</TableCell>
										<TableCell component="th" scope="row" padding="none">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: "capitalize" }}>
	                      {row.action}
                      </span>
										</TableCell>
										<TableCell align="left">{row.userName}</TableCell>
										<TableCell align="left">{formatDate(row.timestamp)}</TableCell>
										<TableCell align="right">
											{row.module}
										</TableCell>
										<TableCell align="right">{row.ipAddress || "--"}</TableCell>
										<TableCell align="right">
											<IconButton onClick={(event) => handleMenuClick(event, index)}>
												<MoreVertIcon />
											</IconButton>
											<Menu
												anchorEl={anchorEls[index]}
												open={Boolean(anchorEls[index])}
												onClose={() => handleMenuClose(index)}
											>
												<MenuItem onClick={()=>{handleViewDetails(row, index); handleMenuClose(index)}}>
													<ListItemIcon>
														<EditIcon />
													</ListItemIcon>
													<ListItemText primary="View Details" />
												</MenuItem>
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
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
			</Paper>
			{/* Modal for viewing audit details */}
			<ViewAuditModal
				isOpen={modalOpen}
				onClose={handleModalClose}
				audit={currentRow} // Pass the current row to the modal
			/>
		</Box>
	);
}
