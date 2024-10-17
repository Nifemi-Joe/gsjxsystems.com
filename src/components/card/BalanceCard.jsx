import styled from "styled-components";
import Balance from "../../assets/images/cash-line.svg"
import Settings from "../../assets/images/settings-4-line.svg"
import USA from "../../assets/images/united states.svg"
import NGN from "../../assets/images/nigeria.svg"
import ChevronDown from"../../assets/images/arrow-drop-down-line.svg"
import Funds from "../../assets/images/funds-line.svg"
import ArrowUp from "../../assets/images/arrow-right-up-line.svg"
import ArrowDown from "../../assets/images/arrow-left-down-line.svg"
import MoreOptionsModal from "../modal/MoreOptionsModal";
import {useState} from "react";
export const Container = styled.div`
	border: 1px solid #D7D8DC;
	border-radius: 20px;
    color: #2E3A59;
	width: 50%;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const HeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	h3{
		font-size: 16px;
		font-weight: 600;
	}
`

export const Button = styled.button`
    border: 1px solid #D7D8DC;
    border-radius: 6px;
    padding: 4px 12px;
    display: flex;
    font-size: 12px;
    font-weight: 600;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in;
    gap: 4px;
    &:hover {
        background-color: rgba(215, 216, 220, 0.3);
    }
`

const AccountContainer = styled.div`
	display: flex;
	flex-direction: column;
    border: 1px solid #D7D8DC;
    border-radius: 8px;
`

const AccountHeader = styled.a`
	background-color: rgba(215, 216, 220, 0.3);
	border-bottom: 1px solid #D7D8DC;
    display: flex;
    text-decoration: none;
    justify-content: space-between;
	align-items: center;
    padding: 6px 8px 6px 12px;
`

const AccountLeft = styled.span`
	display: flex;
	gap: 4px;
	align-items: center;
	font-size: 12px;
`

const AccountContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-top: 24px;
	padding-left: 12px;
	padding-bottom: 12px;
`

const AccountText = styled.div`
	h2{
        font-size: 32px;
		font-weight: 500;
	}
`

export const AccountGreenText = styled.div`
	background-color: ${(props) => props.percentageChange > 0 ? "rgb(239, 254, 250)" : "rgba(253,35,35,0.55)"};
	border-radius: 8px;
	padding: 6px 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: rgb(53, 137, 121);
	font-size: 12px;
	font-weight: 500;
	margin-right: 12px;
`

const ButtonContainer = styled.div`
	display: flex;
	gap: 8px;
	margin: auto 0 0;
`

const BlackButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 8px 12px;
    height: 44px;
	text-decoration: none;
    color: white;
	width: 50%;
	cursor: pointer;
	font-weight: 500;
    background: rgb(26, 27, 37);
    transition: 0.3s all ease-in;
    gap: 6px;
    &:hover {
        background: rgba(26, 27, 37, 0.9);
    }
`

const WhiteButton = styled(BlackButton)`
    border: 1px solid #D7D8DC;
    background: #ffffff;
    color: rgb(26, 27, 37);

    &:hover {
        background: rgba(215, 216, 220, 0.3);
    }
`

const BalanceCard = ({balance, handleCurrencyChange, handleFilterChange, currency, filter, percentageChange}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleMoreOptionsClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<Container>
			<Header>
				<HeaderLeft>
					<img src={Balance} alt="Balance"/>
					<h3>My Balance</h3>
				</HeaderLeft>
				<Button onClick={handleMoreOptionsClick}><img src={Settings} alt="Settings"/>More Option</Button>
			</Header>
			<AccountContainer>
				<AccountHeader>
					<AccountLeft>
						<img src={currency === "USD" ? USA : NGN} alt="Country"/>
						<span>{currency === "USD" ? "US Dollar" : "Nigerian Naira"}</span>
					</AccountLeft>
					<img src={ChevronDown} alt="Chevron Down"/>
				</AccountHeader>
				<AccountContent>
					<AccountText>
						<h2>{currency === "USD" ? "$" : "₦"}{balance}</h2>
					</AccountText>
					<AccountGreenText percentageChange={percentageChange}>
						<span>{percentageChange.toFixed(2)}% {percentageChange > 0 ? "increase" : "decrease"} compared to last month</span>
						<img src={Funds} alt="Funds"/>
					</AccountGreenText>
				</AccountContent>
			</AccountContainer>
			<ButtonContainer>
				{/*<BlackButton>*/}
				{/*	<img src={ArrowUp} alt="Arrow up"/>*/}
				{/*	<span>Send</span>*/}
				{/*</BlackButton>*/}
				{/*<WhiteButton>*/}
				{/*	<img src={ArrowDown} alt="Arrow down"/>*/}
				{/*	<span>Recieve</span>*/}
				{/*</WhiteButton>*/}
			</ButtonContainer>
			<MoreOptionsModal isOpen={isModalOpen} onRequestClose={handleCloseModal} handleCurrencyChange={handleCurrencyChange} handleFilterChange={handleFilterChange} currency={currency} filter={filter}/>
		</Container>
	)
}
export default BalanceCard