export const getEmployees = async (filter) => {
	// Replace with your API call
	const response = await fetch(`/api/employees?filter=${filter}`);
	const data = await response.json();
	return data;
};

export const saveEmployee = async (employee) => {
	// Replace with your API call
	const response = await fetch('/api/employees', {
		method: 'POST',
		body: JSON.stringify(employee),
		headers: { 'Content-Type': 'application/json' },
	});
	return response.json();
};
