import styled from "styled-components";
import Search from "../../assets/images/search-line.svg"
import Notification from "../../assets/images/notification-01.svg"
import BalanceCard from "./BalanceCard";
import SpendingSummaryCard from "./SpendingSummaryCard";
import ATMCard from "./ATMCard";
import BudgetCard from "./BudgetCard";
import RecentTransactionCard from "./RecentTransactionCard";
import {useAuth} from "../../store/auth/AuthContext";
import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../context/DataContext";
import CompanyBanner from "../banner/CompanyBanner";

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 28px 10px 28px;
	border-bottom: 1px solid #F7F9FC;
`

export const HeaderLeft = styled.div`
	display: flex;
	flex-direction: column;
	h2{
		font-weight: 600;
		font-size: 18px;
		color: #2E3A59;
	}
	p{
        font-size: 14px;
        color: #2E3A59;
		font-weight: 300;
	}
`

export const HeaderRight = styled.div`
	display: flex;
	gap: 24px;
	width: 40%;
	align-items: center;
	justify-content: end;
`

export const SearchInput = styled.input`
    padding: 12px 24px 12px 42px;
    width: 100%;
    height: 48px;

    /* White */
    background: #FFFFFF;
    border: 1px solid #cecece;
    outline: none;
    box-shadow: 0px 26px 26px rgba(106, 22, 58, 0.04);
    border-radius: 12px;

    /* Inside auto layout */
    flex: none;
    order: 1;
    flex-grow: 0;
`

export const SearchImage = styled.img`
	position: absolute;
	top: 12px;
	left: 10px;
`

export const NotificationCounter = styled.span`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 4px;
	gap: 5px;
	
	position: absolute;
	width: 14px;
	height: 14px;
	
	/* Error */
	background: #E45757;
	border-radius: 55px;
    font-style: normal;
    font-weight: 600;
    font-size: 9px;
    line-height: 20px;
	top: -4px;
	right: -2px;
    color: #FFFFFF;
`

const DashboardCard = () => {
	const {userDetails} = useAuth();
	const {invoices} = useContext(DataContext);
	const {expenses} = useContext(DataContext);
	const [currency, setCurrency] = useState('NGN');
	const [filter, setFilter] = useState('monthly');

	const handleCurrencyChange = (currencyType) => {
		setCurrency(currencyType);
	};

	const handleFilterChange = (filterType) => {
		setFilter(filterType);
	};
	// Helper function to get the first day of the current month
	const getCurrentMonthStart = () => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), 1);
	};

	// Helper function to get the first day of the current year
	const getCurrentYearStart = () => {
		const now = new Date();
		return new Date(now.getFullYear(), 0, 1);
	};

	// Function to filter by date (monthly or yearly)
	const filterByDate = (transactionDate) => {
		const transaction = new Date(transactionDate);
		if (filter === 'monthly') {
			const monthStart = getCurrentMonthStart();
			return transaction >= monthStart;
		} else if (filter === 'yearly') {
			const yearStart = getCurrentYearStart();
			return transaction >= yearStart;
		}
		return false;
	};

	// Calculate total expected income based on filter and currency
	const totalExpected = () => {
		let total = 0;
		console.log(invoices)
		if (invoices){
			invoices.forEach((invoice) => {
				if (filterByDate(invoice.transactionDate) && invoice.status.toLowerCase() !== "canceled") {
					// Use the appropriate currency
					if (currency === 'USD') {
						total += invoice.totalInvoiceFee_usd;
					} else if (currency === 'NGN') {
						total += invoice.totalInvoiceFee_ngn;
					}
				}
			});
		}
		return total;
	};

	// Calculate total expense based on filter and currency
	const totalExpense = () => {
		let total = 0;
		if (expenses){
			expenses.forEach((expense) => {
				if (filterByDate(expense.transactionDate)) {
					total += expense.amount;
				}
			});
		}
		return total;
	};
	const [percentageChange, setPercentageChange] = useState(0);

	// Helper function to get the first day of the current and previous month
	const getMonthStart = (offset = 0) => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth() + offset, 1);
	};

	// Filter invoices by month
	const filterInvoicesByMonth = (monthStart) => {
		if (invoices){
			return invoices.filter((invoice) => {
				const transactionDate = new Date(invoice.transactionDate);
				return transactionDate >= monthStart && transactionDate < new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
			});
		}
		else return [];

	};

	// Calculate total invoice fees for a given list of invoices
	const calculateTotal = (filteredInvoices) => {
		return filteredInvoices.reduce((total, invoice) => total + (invoice.totalInvoiceFee_usd || 0), 0);
	};

	// Calculate the percentage change between last month and this month
	useEffect(() => {
		const currentMonthStart = getMonthStart(0);
		const previousMonthStart = getMonthStart(-1);

		const currentMonthInvoices = filterInvoicesByMonth(currentMonthStart);
		const previousMonthInvoices = filterInvoicesByMonth(previousMonthStart);

		const currentMonthTotal = calculateTotal(currentMonthInvoices);
		const previousMonthTotal = calculateTotal(previousMonthInvoices);

		// Calculate percentage change
		if (previousMonthTotal > 0) {
			const change = ((currentMonthTotal - previousMonthTotal) / currentMonthTotal) * 100;
			setPercentageChange(change);
		} else {
			setPercentageChange(0); // If no invoices last month, no change can be calculated
		}
	}, [invoices]);
	const balance = (totalExpected() - totalExpense()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	console.log(balance + "expected" + totalExpected() + "expense" + totalExpense())
	const userRole = userDetails?.role;
	const hasCompany = userDetails?.companyId //
	return (
		<div className="w-full">
			<Header>
				<HeaderLeft>
					<h2>Hello, {userDetails && userDetails.name}👋</h2>
					<p className="text-capitalize">{userDetails?.role}</p>
				</HeaderLeft>
				<HeaderRight>
					<div className="relative w-3/4">
						<SearchInput placeholder="Search...." type="search"/>
						<SearchImage src={Search} alt="Search"/>
					</div>
					<div>
						<a href="#" className="relative">
							<img src={Notification} alt="Notification"/>
							<NotificationCounter>2</NotificationCounter>
						</a>
					</div>
				</HeaderRight>
			</Header>
			{!hasCompany && <CompanyBanner />}
			<div className="flex justify-between pt-4 pl-6 pr-6 gap-6">
				<BalanceCard className="w-1/2" balance={balance} handleCurrencyChange={handleCurrencyChange} handleFilterChange={handleFilterChange} currency={currency} filter={filter} percentageChange={percentageChange}/>
				<SpendingSummaryCard className="w-1/2" handleCurrencyChange={handleCurrencyChange} handleFilterChange={handleFilterChange} currency={currency} filter={filter}/>
				{/*<ATMCard/>*/}
			</div>
			<div className="flex justify-between pt-4 pl-6 pr-6 gap-6">
				<BudgetCard currency={currency}/>
				<RecentTransactionCard expenses={expenses} invoices={invoices} currency={currency}/>
			</div>
		</div>
	)
}
export default DashboardCard