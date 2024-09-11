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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import MoreLines from "../../assets/images/more-line.svg"
import styled from "styled-components";
import GreenDot from "../../assets/images/green-dot.svg"
import RedDot from "../../assets/images/red-dot.svg"
import GreyDot from "../../assets/images/grey-dot.svg"
import Plus from "../../assets/images/add-line.svg"
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
	createData("001", 'ABC Corp', "Website Design", 2500, "abc@email.com", "", "Active" ),
	createData("002", 'Delta Designs', "Branding Package", 3500, "jake@deltadesigns.com", "", "Active"),
	createData("003", 'Urban Tech', "Saas Dashboard Design", 4200, "sydney@urbantech.com", "","Active"),
	createData("005", 'NexaTech', "Mobile App UI/UX", 5000, "steve@nexatech.com", "","Completed"),
	createData("006", 'ByteBloom', "Mobile App UI/UX", 6500, "ryan@bytebloom.com", "","Inactive"),
	createData("007", 'VirtuFusion', "VR Interface Design", 4800, "abesh@virtufusion.com", "", "Active"),
	createData("008", 'NeuralNet Systems', "AI Platform UI", 3800, "dave@neuralnet.com", "", "Inactive"),
	createData("009", 'Skyward Drones', "Drone Control UI", 5200, "contact@skywarddrones.com", "", "Completed"),
	createData("010", 'DataDive Analytics', "Data Visualisation Tool", 4000, "support@datadrive.com", "", "Active")
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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
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
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'Client ID',
	},
	{
		id: 'name',
		numeric: true,
		disablePadding: false,
		label: 'Client Name',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'Project Title',
	},
	{
		id: 'contact',
		numeric: true,
		disablePadding: false,
		label: 'Contact',
	},
	{
		id: 'total',
		numeric: true,
		disablePadding: false,
		label: 'Total Invoice ($)',
	},
	{
		id: 'status',
		numeric: true,
		disablePadding: false,
		label: 'Status',
	},
	{
		id: 'icon',
		numeric: true,
		disablePadding: false,
		label: '',
	},
];

function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
		props;
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
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

export const Button = styled.button`
    /* Type=Secondary, Size=Large, States=Focused, Icon Only=False */

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 16px;
    gap: 8px;
    height: 52px;
    font-weight: 500;
    font-size: 16px;
	transition: all 0.3s ease-in;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #0D0D12;
    background: #FFFFFF;
    /* Focused/gray */
    box-shadow: 0px 0px 1px 1px rgba(129, 136, 152, 0.1), inset 0px 0px 0px 1px #C1C7D0;
    border-radius: 12px;
	&:hover{
		background:  rgba(129, 136, 152, 0.1);
	}
`

function EnhancedTableToolbar(props) {
	const { numSelected } = props;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
				}),
			}}
		>
			{numSelected > 0 && (
				<Typography
					sx={{ flex: '1 1 100%' }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list" className="flex justify-between w-full pb-3 pt-3">
					<IconButton>
						<FilterListIcon />
					</IconButton>
					<Button><img src={Plus} alt="Add"/>Add Client</Button>
				</Tooltip>
			)}
		</Toolbar>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const ContactText = styled.span`
	color: rgb(44,152,245);
	font-weight: 500;
`

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

export default function EnhancedTable() {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
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

	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (id) => selected.indexOf(id) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			stableSort(rows, getComparator(order, orderBy)).slice(
				page * rowsPerPage,
				page * rowsPerPage + rowsPerPage,
			),
		[order, orderBy, page, rowsPerPage],
	);

	return (
		<Box sx={{ width: '100%' }} className="pl-6 pr-5">
			<Paper sx={{ width: '100%', mb: 2 }}>
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
							align="right"
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{visibleRows.map((row, index) => {
								const isItemSelected = isSelected(row.id);
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row.id)}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.id}
										selected={isItemSelected}
										sx={{ cursor: 'pointer' }}
									>
										<TableCell
											component="th"
											id={labelId}
											scope="row"
											align="left"
											padding="12px"
										>
											{row.id}
										</TableCell>
										<TableCell align="left">{row.name}</TableCell>
										<TableCell align="left">{row.title}</TableCell>
										<TableCell align="left"><ContactText>{row.contact}</ContactText></TableCell>
										<TableCell align="left"><span className="font-semibold">{row.total}</span></TableCell>
										<TableCell align="left">{row.status === "Active" ? <StatusText><img src={GreenDot} alt="Green Dot"/><span>{row.status}</span></StatusText> : row.status === "Inactive" ? <RedStatusText><img src={RedDot} alt="Red Doot"/><span>{row.status}</span></RedStatusText> : <GreyStatusText><img src={GreyDot} alt="Grey Dot"/><span>{row.status}</span></GreyStatusText>}</TableCell>
										<TableCell align="left"><img src={MoreLines} alt="More lines"/></TableCell>
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
			</Paper>
		</Box>
	);
}
