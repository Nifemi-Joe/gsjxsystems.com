import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const [employees, setEmployees] = useState([]);
	const [taxes, setTaxes] = useState([]);
	const [vat, setVat] = useState([]);

	const [rates, setRates] = useState([]);

	const [invoices, setInvoices] = useState([]);
	const [expenses, setExpenses] = useState([]);
	const [clients, setClients] = useState([]);
	const [users, setUsers] = useState([]);
	const [companies, setCompanies] = useState({});
	const [auditLogs, setAuditLogs] = useState([]);

	return (
		<DataContext.Provider value={{ employees, setEmployees, taxes, setTaxes, vat, setVat, rates, setRates ,invoices, setInvoices, expenses, setExpenses, clients, setClients, users, setUsers, companies, setCompanies, auditLogs, setAuditLogs }}>
			{children}
		</DataContext.Provider>
	);
};
