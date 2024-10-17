import React from 'react';
import { TextField, Box } from '@mui/material';

const EmployeeFilters = ({ setFilter }) => {
	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	return (
		<Box sx={{ p: 2 }}>
			<TextField
				label="Filter by name"
				variant="outlined"
				onChange={handleFilterChange}
				fullWidth
			/>
		</Box>
	);
};

export default EmployeeFilters;
