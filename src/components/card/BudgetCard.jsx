import { Button, Container, Header, HeaderLeft } from "./BalanceCard";
import { HeaderSpending } from "./SpendingSummaryCard";
import { BarChart } from '@mui/x-charts/BarChart';
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import AtmCard from "../../assets/images/bank-card-line.svg"
import styled from "styled-components";
import ChevronDown from "../../assets/images/arrow-drop-down-line.svg"
import ArrowUp from "../../assets/images/arrow-right-up-line-blue.svg"
import ArrowDown from "../../assets/images/arrow-left-down-line.svg"
const LegendContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;

    &::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        background-color: ${(props) => props.color || "#000"};
        border-radius: 50%;
        margin-right: 5px;
    }
`;

const EntireContainer = styled(Container)`
    width: 66%;
`;

const GreyContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    background: rgb(248, 245, 255);
    border-radius: 50%;
`;

const BlueContainer = styled(GreyContainer)`
    background: rgb(229, 239, 255);
`;

const AmountTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    h6{
        color: rgb(144, 151, 165);
        font-size: 12px;
        font-weight: 400;
    }
    p{
        color: rgb(32, 32, 37);
        font-weight: 600;
    }
`;

const Seperator = styled.div`
    background: rgb(239, 240, 243);
    width: 1px;
    height: auto;
    align-self: stretch;
    border: 1px solid rgb(239, 240, 243);
    margin-right: 20px;
`;

const chartSetting = {
	yAxis: [{
		border: { show: false }
	}],
	height: 300,
	sx: {
		'.MuiTypography-root': {
			fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
		},
	},
};

const BudgetCard = ({currency}) => {
	const { invoices, expenses } = useContext(DataContext);

	// Process data to display in chart for income and outcome (expenses)
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const month = date.toLocaleString('en-US', { month: 'short' });
		return month.toUpperCase();
	};
	let invoiceData = [];
	if (invoices){
		invoiceData = invoices.reduce((acc, invoice) => {
			const month = formatDate(invoice.transactionDate);
			if (currency === "USD"){
				acc[month] = (acc[month] || 0) + invoice.totalInvoiceFee_usd;
			}
			else if (currency === "NGN"){
				acc[month] = (acc[month] || 0) + invoice.totalInvoiceFee_ngn;
			}
			return acc;
		}, {});
	}
	let expenseData = [];
	if (expenses){
		expenseData = expenses.reduce((acc, expense) => {
			const month = formatDate(expense.date);
			acc[month] = (acc[month] || 0) + expense.amount;
			return acc;
		}, {});
	}
	// Prepare the data for chart
	const months = [...new Set([...Object.keys(invoiceData), ...Object.keys(expenseData)])];

	// Extract months for x-axis

	// Generate data for the chart
	const chartIncomeData = months.map((month) => invoiceData[month] || 0);
	const chartExpenseData = months.map((month) => expenseData[month] || 0);

	return (
		<EntireContainer>
			<HeaderSpending>
				<HeaderLeft>
					<img src={AtmCard} alt="Bank card" />
					<h3>Budget overview</h3>
				</HeaderLeft>
				<div className="flex items-center gap-2">
					<LegendContainer>
						<LegendItem color="#000000">Income</LegendItem>
						<LegendItem color="rgb(102, 161, 255)">Expenses</LegendItem>
					</LegendContainer>
					<Button>
						<img src={ChevronDown} alt="Chevron Down" />
						<span>More option</span>
					</Button>
				</div>
			</HeaderSpending>

			<div className="flex justify-between items-center">
				<div className="flex items-center gap-1.5 w-1/2">
					<GreyContainer>
						<img src={ArrowDown} alt="Arrow down" />
					</GreyContainer>
					<AmountTextContainer>
						<h6>Income</h6>
						<p>{currency === "NGN" ? "₦" : "$"}{chartIncomeData.reduce((a, b) => a + b, 0).toLocaleString()}</p>
					</AmountTextContainer>
				</div>
				<div className="flex items-center gap-1.5 w-1/2">
					<Seperator />
					<BlueContainer>
						<img src={ArrowUp} alt="Arrow up" />
					</BlueContainer>
					<AmountTextContainer>
						<h6>Expenses</h6>
						<p>{currency === "NGN" ? "₦" : "$"}{chartExpenseData.reduce((a, b) => a + b, 0).toLocaleString()}</p>
					</AmountTextContainer>
				</div>
			</div>

			<BarChart
				borderRadius={4}
				xAxis={[{
					scaleType: 'band',
					dataKey: "",
					data: months,
				}]}
				yAxis={{
					border: { show: false },
					grid: {
						show: true,
						lineStyle: { color: '#E0E0E0', width: 1 },
					},
				}}
				grid={{ horizontal: true }}
				series={[
					{
						label: "Income",
						data: chartIncomeData,
						color: 'rgb(102, 161, 255)',  // Color for Income
					},
					{
						label: "Expenses",
						data: chartExpenseData,
						color: '#000000',  // Color for Expenses
					}
				]}
				{...chartSetting}
			/>
		</EntireContainer>
	);
};

export default BudgetCard;
