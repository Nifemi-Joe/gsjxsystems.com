import {Button, Container, Header, HeaderLeft} from "./BalanceCard";
import Exchange from "../../assets/images/exchange-dollar-line.svg"
import ChevronDown from "../../assets/images/arrow-drop-down-line.svg"
import ChevronLeft from "../../assets/images/arrow-drop-right-line.svg"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styled from "styled-components";
import Netflix from "../../assets/images/netflix.svg"
import Youtube from "../../assets/images/youtube.svg"
import ChevronUp from "../../assets/images/arrow-right-up-line-black.svg"
import Background from '../../assets/images/background.avif';

const TransactionContainer = styled.div`
	display: flex;
	flex-direction: column;
	border-top: 1px solid rgb(223, 225, 231);
`

const TransactionItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 16px;
	padding-bottom: 16px;
    border-bottom: 1px solid rgb(223, 225, 231);
`

const TransactionLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`

const TransactionRight = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
`

const ImageContainer = styled.div`
	border: 1px solid rgb(225, 227, 233);
	//padding: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	img{
        width: 44px;
        height: 44px;
        border-radius: 50%;
        //border: 1px solid #fff;
        background: rgba(236, 239, 243, 0.9);
	}
`

const TransactionLeftTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 12px;
	h3{
		color: rgb(13, 13, 18);
		font-weight: 600;
	}
	p{
		color: rgb(144, 151, 165);
		font-weight: 400;
		font-size: 10px;
		//text-align: end;
	}
`

const TransactionButton = styled.div`
    /* Type=Secondary, Size=XSmall, States=Default, Icon Only=False */

    box-sizing: border-box;

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    gap: 8px;
	width: 100%;

    /* White/900 */
    background: #FFFFFF;
    /* Greyscale/100 */
    border: 1px solid #DFE1E7;
    /* Shadow/XSmall */
    box-shadow: 0px 1px 2px rgba(13, 13, 18, 0.06);
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
	transition: 0.3s all ease-in;
    line-height: 18px;
    /* identical to box height */
    text-align: center;
    letter-spacing: 0.01em;
	margin-top: 16px;
	cursor: pointer;
    /* Greyscale/900 */
    color: #0D0D12;
	&:hover{
		background: #DFE1E7;
	}
`
const RecentTransactionCard = ({expenses, invoices, currency}) => {
	const sortedTransactions = expenses ? expenses.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
	const sortedInvoices = invoices ? invoices.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)) : [];

	const formatDate = (dateString) => {
		const date = new Date(dateString);  // Convert string to Date object
		const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Get month (0-11, so add 1)
		const year = date.getFullYear().toString().slice(-2);   // Get last 2 digits of year
		return `${month}/${year}`;  // Return in MM/YY format
	};

// Example usage
	const formattedDate = formatDate('2024-09-29T00:00:00.000Z');
	console.log(formattedDate);  // Outputs: 09/24
	return(
		<Container>
			<Header>
				<HeaderLeft>
					<img src={Exchange} alt="Exchange"/>
					<h3>Recent Transactions</h3>
				</HeaderLeft>
				<Button>
					<img src={ChevronDown} alt="Chevron down"/>
					<span>Last week</span>
				</Button>
			</Header>
			<Tabs
				defaultActiveKey="outcome"
				id="uncontrolled-tab-example"
				className="mb-3"
			>
				<Tab eventKey="income" title="Income">
					<TransactionContainer>
						{
							sortedInvoices.slice(0, 3).map((transaction)=> <TransactionItem key={transaction.id}>
								<TransactionLeft>
									<ImageContainer>
										<img src={transaction.image ? transaction.image : Background} alt={transaction.name}/>
									</ImageContainer>
									<TransactionLeftTextContainer>
										<h3>{transaction.companyName}</h3>
										<p>{transaction.invoiceType}</p>
									</TransactionLeftTextContainer>
								</TransactionLeft>
								<TransactionRight>
									<TransactionLeftTextContainer>
										<h3>₦{transaction.totalInvoiceFeePlusVat_ngn}</h3>
										<p style={{textAlign: "end"}}>{formatDate(transaction.transactionDate)}</p>
									</TransactionLeftTextContainer>
									<img src={ChevronLeft} alt="Chevron down"/>
								</TransactionRight>
							</TransactionItem>)
						}
						<TransactionButton><span>See All</span><img src={ChevronUp} alt="Chevron down"/></TransactionButton>
					</TransactionContainer>				</Tab>
				<Tab eventKey="outcome" title="Outcome">
					<TransactionContainer>
						{
							sortedTransactions.slice(0, 3).map((transaction)=> <TransactionItem key={transaction.id}>
								<TransactionLeft>
									<ImageContainer>
										<img src={transaction.image ? transaction.image : Background} alt={transaction.name}/>
									</ImageContainer>
									<TransactionLeftTextContainer>
										<h3>{transaction.name}</h3>
										<p>{transaction.description}</p>
									</TransactionLeftTextContainer>
								</TransactionLeft>
								<TransactionRight>
									<TransactionLeftTextContainer>
										<h3>₦{transaction.amount}</h3>
										<p style={{textAlign: "end"}}>{formatDate(transaction.date)}</p>
									</TransactionLeftTextContainer>
									<img src={ChevronLeft} alt="Chevron down"/>
								</TransactionRight>
							</TransactionItem>)
						}
						<TransactionButton><span>See All</span><img src={ChevronUp} alt="Chevron down"/></TransactionButton>
					</TransactionContainer>
				</Tab>
				<Tab eventKey="pending" title="Pending">
					<TransactionContainer>
						{
							sortedInvoices.slice(0, 3).map((transaction)=> <TransactionItem key={transaction.id}>
								<TransactionLeft>
									<ImageContainer>
										<img src={transaction.image ? transaction.image : Background} alt={transaction.name}/>
									</ImageContainer>
									<TransactionLeftTextContainer>
										<h3>{transaction.companyName}</h3>
										<p>{transaction.invoiceType}</p>
									</TransactionLeftTextContainer>
								</TransactionLeft>
								<TransactionRight>
									<TransactionLeftTextContainer>
										<h3>₦{transaction.totalInvoiceFeePlusVat_ngn}</h3>
										<p style={{textAlign: "end"}}>{formatDate(transaction.transactionDate)}</p>
									</TransactionLeftTextContainer>
									<img src={ChevronLeft} alt="Chevron down"/>
								</TransactionRight>
							</TransactionItem>)
						}
						<TransactionButton><span>See All</span><img src={ChevronUp} alt="Chevron down"/></TransactionButton>
					</TransactionContainer>				</Tab>
			</Tabs>
		</Container>
	)
}
export default RecentTransactionCard