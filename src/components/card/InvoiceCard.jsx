import styled from "styled-components";
import Logo from "../../assets/images/logo.jpg"
import {useRef} from "react";
import CreateInvoiceModal from "../modal/CreateInvoiceModal";


const Header = styled.div`
	display: flex;
	justify-content: space-between;
`

const LogoContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	span{
		color: black;
	}
`

const AddressContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const PurpleText = styled.span`
    color: rgb(214, 171, 252);
    font-size: 18px;
    font-weight: 900;
    font-style: italic;
`

const WhiteText = styled.span`
	color: black;
	font-size: 14px;
    font-style: italic;
	font-weight: 400;
`

const GreyContainer = styled.div`
	border: 2px solid rgb(255, 255, 255);
	border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	background: rgb(187, 187, 187);
	width: fit-content;
	margin: 24px auto 0 auto;
	padding: 16px 32px;
	font-weight: 900;
	font-size: 16px;
`

const DateContainer = styled.div`
	display: flex;
	width: 60%;
	padding-top: 24px;
    margin: 0 auto;
	justify-content: space-between;
`

const TableHeader = styled.div`
    background: rgb(187, 187, 187);
    font-weight: 900;
    font-size: 16px;
    padding: 8px 16px;
`

const convertStringToNumber = (str) => {
	// Remove commas from the string
	const cleanedString = str.replace(/,/g, '');

	// Convert the cleaned string to a number
	const number = parseFloat(cleanedString);

	return number;
};




const formatNumber = (num) => {
	return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Example usage

const InvoiceCard = () => {
	const transactions = [
		{
			id: 1,
			name: "AUTHENTICATION FEE FOR PERIOD",
			startdate: "JULY 01, 2024",
			enddate: "JULY 31, 2024",
			transactions: [
				{
					id: 1,
					name: "ACS Transaction Fees",
					volume: "401,713",
					unitfee: "0.02",
					totalfeeusd: "8,034.26",
					totalfeengn: "12,791,184.66"
				},
				{
					id: 2,
					name: "RBA Transaction Fees",
					volume: "397,671",
					unitfee: "0.02",
					totalfeeusd: "7,953.42",
					totalfeengn: "12,662,480.91"
				}
			]
		},
		{
			id: 2,
			name: "MONTHLY HOSTING FEE FOR PERIOD",
			startdate: "JULY 01, 2024",
			enddate: "JULY 31, 2024",
			transactions: [
				{
					id: 1,
					name: "Monthly Hosting Fee For",
					volume: "1",
					unitfee: "2,300.00",
					totalfeeusd: "2,300.00",
					totalfeengn: "3,661,784.00"
				},
				{
					id: 2,
					name: "Monthly Hosting Fee For",
					volume: "1",
					unitfee: "2,300.00",
					totalfeeusd: "2,300.00",
					totalfeengn: "3,661,784.00"
				}
			]
		},
	];
	const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
	return (
		<div className="w-3/5 mx-auto pt-6 pb-16 px-3 mt-3 rounded second-font border border-slate-200">
			<Header>
				<LogoContainer>
					<img src={Logo} alt="Logo"/>
					<span>RC: 918111</span>
				</LogoContainer>
				<AddressContainer>
					<PurpleText className="second-font-bold">
						Global SJX Limited
					</PurpleText>
					<WhiteText>
						Block 3 Plot 57b, Fatai Arobieke Street,<br/>
						Lekki Phase I, Lagos.
					</WhiteText>
					<PurpleText>E-Mail: <WhiteText> talk2us@globalsjxltd.com</WhiteText></PurpleText>
					<PurpleText>Website: <WhiteText> talk2us@globalsjxltd.com</WhiteText></PurpleText>
				</AddressContainer>
			</Header>
			<GreyContainer>
				AUTHENTICATION TRANSACTIONS INVOICE
			</GreyContainer>
			<DateContainer>
				<span className="flex flex-column">
					<span><span className="font-bold">Issue Date:</span> 08/08/2024</span>
					<span><span className="font-bold">Invoice Ref:</span> FBN/ACS/2024/07</span>
				</span>
				<span><span className="font-bold">Due Date: </span> 19/08/2024</span>
			</DateContainer>
			<div className="w-full border border-slate-200 mt-4">
				{
					transactions.map((transaction, index) => <div className="w-full" key={transaction.id}>
							<TableHeader>
								<span
									className="capitalize">{alphabet[index]}</span> - {transaction.name}: {transaction.startdate} – {transaction.enddate}
							</TableHeader>

							<table className="w-full table">
								<thead>
								<tr>
									<th>Description</th>
									<th>Volume</th>
									<th className="text-center">Unit Fee (USD)</th>
									<th className="text-center">Total Fee (USD)</th>
									<th className="text-center">Total Fee (NGN)</th>
								</tr>
								</thead>
								<tbody>
								{
									transaction.transactions.map((transact) => <tr key={transact.id}>
										<td>{transact.name}</td>
										<td>{transact.volume}</td>
										<td>{transact.unitfee}</td>
										<td>{transact.totalfeeusd}</td>
										<td>{transact.totalfeengn}</td>
									</tr>)
								}
								</tbody>
								<tfoot>
								<tr>
									<td colSpan="3" className="font-bold italic">Sub-Total - <span
										className="capitalize">{alphabet[index]}</span></td>
									<td className="font-bold italic">{formatNumber(convertStringToNumber(transaction.transactions[0].totalfeeusd) + convertStringToNumber(transaction.transactions[1].totalfeeusd))}</td>
									<td className="font-bold italic">{formatNumber(convertStringToNumber(transaction.transactions[0].totalfeengn) + convertStringToNumber(transaction.transactions[1].totalfeengn))}</td>
								</tr>
								</tfoot>
							</table>
						</div>
					)
				}
				<table className="w-full table-1">
					<tbody>
					<tr>
						<td colSpan="12" className="font-bold">TOTAL FEE (A+B)</td>
						<td className="font-bold italic text-right">20,587.68</td>
						<td className="font-bold italic text-right">32,777,233.57</td>
					</tr>
					</tbody>
					<tbody>
					<tr>
						<td colSpan="12" className="font-bold">VAT</td>
						<td className="font-bold italic text-right">1,544.08</td>
						<td className="font-bold italic text-right">2,458,292.52</td>
					</tr>
					</tbody>
					<tfoot>
					<tr>
						<td colSpan="12" className="font-bold">GRAND TOTAL in NGN (CBN: N1,592.08/$1 as @ 07/08/2024)
						</td>
						<td className="font-bold italic text-right"></td>
						<td className="font-bold italic text-right">35,235,526.09</td>
					</tr>
					</tfoot>
					<tfoot>
					<tr>
						<td colSpan="12" className="font-bold">GRAND TOTAL in USD</td>
						<td className="font-bold italic text-right">22,131.76</td>
						<td className="font-bold italic text-right"></td>
					</tr>
					</tfoot>
				</table>
				<div className="px-2 py-2 font-black border-slate-200 border-b">AMOUNT IN WORDS: <span
					className="italic font-normal">Thirty-Five Million, Two Hundred and Thirty-Five Thousand, Five Hundred and Twenty-Six Naira, and Nine Kobo Only</span>
				</div>
				<div className="px-2 py-2 font-black border-slate-200 border-b">INSTRUCTION:
					<div
						className="italic font-normal flex gap-4 items-baseline">
						<span>i.</span><span>	Kindly credit our NGN account with details below with the NGN value above.</span>
					</div>
					<div className="italic font-normal flex gap-4 items-baseline">
						<span>ii.</span><span>Please debit our account for the WHT and remit accordingly using the Tax details below.</span>

					</div>
				</div>
			</div>

		</div>
	)
}
export default InvoiceCard