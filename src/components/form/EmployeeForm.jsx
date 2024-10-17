import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

const EmployeeForm = ({ employee, onSave }) => {
	const { register, handleSubmit } = useForm({
		defaultValues: employee || {},
	});

	const onSubmit = (data) => {
		onSave(data);
	};

	return (
		<Box sx={{ p: 2 }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField {...register('name')} label="Name" fullWidth margin="normal" />
				<TextField {...register('position')} label="Position" fullWidth margin="normal" />
				<TextField {...register('status')} label="Status" fullWidth margin="normal" />
				<Button type="submit" variant="contained">Save</Button>
			</form>
		</Box>
	);
};

export default EmployeeForm;
