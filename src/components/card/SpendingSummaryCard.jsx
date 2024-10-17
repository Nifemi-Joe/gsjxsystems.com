import {AccountGreenText, Button, Container, Header, HeaderLeft} from "./BalanceCard";
import Pie from "../../assets/images/pie-chart-2-line.svg"
import ChevronDown from "../../assets/images/arrow-drop-down-line.svg"
import Icon from "../../assets/images/information-2-line.svg"
import styled from "styled-components";
import {
	GaugeContainer,
	GaugeValueArc,
	GaugeReferenceArc,
	useGaugeState,
} from '@mui/x-charts/Gauge';
import {useContext, useState} from "react";
import {DataContext} from "../../context/DataContext";
import MoreOptionsModal from "../modal/MoreOptionsModal";

function GaugePointer() {
	const { valueAngle, outerRadius, cx, cy } = useGaugeState();

	if (valueAngle === null) {
		// No value to display
		return null;
	}

	const target = {
		x: cx + outerRadius * Math.sin(valueAngle),
		y: cy - outerRadius * Math.cos(valueAngle),
	};
	return (
		<g>
			<circle cx={cx} cy={cy} r={5} fill="red" />
			<path
				d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
				stroke="red"
				strokeWidth={3}
			/>
		</g>
	);
}

export const HeaderSpending = styled(Header)`
	border-bottom: 1px solid #D7D8DC;
	padding-bottom: 12px;
`

const AccountBlueText = styled(AccountGreenText)`
	background: rgb(240, 251, 255);
	color: rgb(45, 125, 164);
`

const AmountText = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 4px;
    margin: -40px auto 0 auto;
    span{
        font-size: 20px;
        font-weight: 500;
    }
	h3{
        font-size: 30px;
        font-weight: 600;
	}
    
`
const SpendingSummaryCard = ({ handleCurrencyChange, handleFilterChange, currency, filter }) => {
	const { expenses } = useContext(DataContext);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleMoreOptionsClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};
	const formatNumber = (num) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const filterByDate = (transactionDate) => {
		const transaction = new Date(transactionDate);
		if (filter === 'monthly') {
			const now = new Date();
			const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
			return transaction >= monthStart;
		} else if (filter === 'yearly') {
			const now = new Date();
			const yearStart = new Date(now.getFullYear(), 0, 1);
			return transaction >= yearStart;
		}
		return false;
	};

	const totalExpenses = () => {
		let total = 0;
		if (expenses){
			expenses.forEach((expense) => {
				if (filterByDate(expense.date)) {
					total += (currency === 'USD' ? expense.amount : expense.amount);
				}
			});
		}
		return total;
	};
	return (
		<Container>
			<HeaderSpending>
				<HeaderLeft>
					<img src={Pie} alt="Pie chart"/>
					<h3>Spending summary</h3>
				</HeaderLeft>
				<Button onClick={handleMoreOptionsClick}>
					<span>More option</span>
					<img src={ChevronDown} alt="Chevron Down"/>
				</Button>
			</HeaderSpending>
			<div className="flex items-center justify-center" style={{marginTop: "-18px"}}>
				<GaugeContainer
					cornerRadius="50%"
					width={150}
					height={150}
					startAngle={-110}
					endAngle={110}
					value={(16000/24450) * 100}
				>
					<GaugeReferenceArc />
					<GaugeValueArc className="arc"/>
					<GaugePointer />
				</GaugeContainer>
			</div>
			<AmountText>
				<span>Spending</span>
				<h3>{currency === 'USD' ? `$${formatNumber(totalExpenses())}` : `₦${formatNumber(totalExpenses())}`}</h3></AmountText>
			<AccountBlueText>
				<span>Your weekly spending limit is {currency === 'USD' ? '$2000' : '₦1,500,000'}</span>
				<img src={Icon} alt="Information"/>
			</AccountBlueText>
			<MoreOptionsModal isOpen={isModalOpen} onRequestClose={handleCloseModal} handleCurrencyChange={handleCurrencyChange} handleFilterChange={handleFilterChange} currency={currency} filter={filter}/>

		</Container>
	)
}
export default SpendingSummaryCard