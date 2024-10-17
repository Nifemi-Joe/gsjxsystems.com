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
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GreenDot from '../../assets/images/file-text-line-green.svg';
import RedDot from '../../assets/images/file-text-line-red.svg';
import Background from '../../assets/images/background.avif';
import {useAuth} from "../../store/auth/AuthContext";

const StatusText = styled.span`
	display: flex;
	width: fit-content;
	flex-direction: row;
	align-items: center;
	padding: 2px 10px 2px 8px;
	gap: 4px;
	background: #ECF9F7;
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

const ImageContainer = styled.img`
	width: 44px;
	height: 44px;
	border-radius: 50%;
	border: 1px solid #fff;
	background: rgba(236, 239, 243, 0.9);
`;

// Sorting functions
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

const headCells = [
	{ id: 'description', numeric: false, disablePadding: true, label: 'Description' },
	{ id: 'date', numeric: false, disablePadding: true, label: 'Date' },
	{ id: 'reciept', numeric: true, disablePadding: false, label: 'Reciept' },
	{ id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
	{ id: 'actions', numeric: true, disablePadding: false, label: '' },

];

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
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	onRequestSort: PropTypes.func.isRequired,
};

export default function ExpenseTable({ rows }) {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('description');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [currentRow, setCurrentRow] = React.useState(null);
	const {userDetails} = useAuth();
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

	const handleMenuClick = (event, row) => {
		setAnchorEl(event.currentTarget);
		setCurrentRow(row);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setCurrentRow(null);
	};

	const handleEdit = () => {
		console.log('Edit', currentRow);
		handleMenuClose();
	};

	const handleDelete = () => {
		console.log('Delete', currentRow);
		handleMenuClose();
	};

	const handleToggleStatus = () => {
		console.log('Toggle Status', currentRow);
		handleMenuClose();
	};

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
			year: 'numeric'
		});
		return formatter.format(date);
	}

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
						<EnhancedTableHead
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{visibleRows.map((row, index) => (
								<TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
									<TableCell align="left" padding="12px">
										<span className="flex items-center gap-2">
											<ImageContainer src={row.image || Background} alt={row.description}/>
											{row.description}
										</span>
									</TableCell>
									<TableCell align="left">{formatDate(row.date)}</TableCell>
									<TableCell align="right">
										{row.reciept ? <img src={GreenDot} alt="Green Dot"/> : <img src={RedDot} alt="Red Dot"/>}
									</TableCell>
									<TableCell align="left">
										<span className="text-black font-semibold">
											₦{row.amount}
											<span className="flex items-center text-gray-500 gap-1 font-normal">
												<span>7.5%</span>
												<span>{((row.amount * (7.5/100)))}</span>
											</span>
										</span>
									</TableCell>
									<TableCell>
										<IconButton onClick={(event) => handleMenuClick(event, row)}>
											<MoreVertIcon />
										</IconButton>
										<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
											{
												(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("edit-expense")) && <MenuItem onClick={handleEdit}>
													<ListItemIcon>
														<EditIcon fontSize="small" />
													</ListItemIcon>
													<ListItemText>Edit</ListItemText>
												</MenuItem>
											}
											{
												(userDetails.role === "superadmin" || userDetails.role === "admin" || userDetails.role === "clientAdmin" || userDetails.permissions.includes("delete-expense")) && <MenuItem onClick={handleDelete}>
													<ListItemIcon>
														<DeleteIcon fontSize="small" />
													</ListItemIcon>
													<ListItemText>Delete</ListItemText>
												</MenuItem>
											}
											<MenuItem onClick={handleToggleStatus}>
												<ListItemIcon>
													{currentRow?.status === 'active' ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
												</ListItemIcon>
												<ListItemText>
													{currentRow?.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}
												</ListItemText>
											</MenuItem>
										</Menu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 50]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
}
