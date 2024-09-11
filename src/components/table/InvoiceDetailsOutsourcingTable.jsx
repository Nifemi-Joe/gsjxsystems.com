import styled from "styled-components";

const InvoiceContainer = styled.div`
    width: 100%;
    margin: 24px auto;
    color: #333;
	border-radius: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
	
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.th`
  background-color: rgb(243, 236, 254);
  color: black;
  padding: 8px;
	font-weight: 500;
  text-align: left;
  border: 1px solid #ddd;
`;

const TableData = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
    &:first-child {
        width: 50%;  /* The first column takes up 50% of the table width */
    }
`;

const SectionTitle = styled.h2`
  background-color: #f1f1f1;
  padding: 10px;
	font-weight: 500;
    border-radius: 8px  8px 0 0;

`;

const SummarySection = styled.div`
  margin-top: 20px;
`;

const SummaryItem = styled.p`
  font-weight: bold;
`;
const InvoiceDetailsTable = ({invoiceData}) => {
	const formatNumber = (num) => {
		return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	};
	const serviceOneTotalUsd = () => {
		let total = 0;
		invoiceData.service1.transactions.map((transaction)=> {
			total = total + transaction.totalfee_usd
		})
		return total
	}
	const serviceOneTotalNgn = () => {
		let total = 0;
		invoiceData.service1.transactions.map((transaction)=> {
			total = total + transaction.totalfee_ngn
		})
		return total
	}
	const serviceTwoTotalUsd = () => {
		let total = 0;
		invoiceData.service2.transactions.map((transaction)=> {
			total = total + transaction.totalfee_usd
		})
		return total
	}
	const serviceTwoTotalNgn = () => {
		let total = 0;
		invoiceData.service2.transactions.map((transaction)=> {
			if (transaction.totalfee_ngn){
				total = total + transaction.totalfee_ngn
			}
			else {
				total = total + (transaction.totalfee_usd * transaction.usd_ngn_rate)
			}
		})
		return total
	}
	return(
		<InvoiceContainer>
			<a href="#" className="text-right justify-end flex text-blue-500">+ Add Transaction</a>
			<SectionTitle>A - Authentication Fees</SectionTitle>
			<Table>
				<thead>
				<TableRow>
					<TableHeader>Description</TableHeader>
					<TableHeader>Volume</TableHeader>
					<TableHeader>Unit Fee (USD)</TableHeader>
					<TableHeader>Total Fee (USD)</TableHeader>
					<TableHeader>Total Fee (NGN)</TableHeader>
				</TableRow>
				</thead>
				<tbody>
				{
					invoiceData.service1.transactions.map((transaction, index) => <TableRow key={index}>
						<TableData>{transaction.description}</TableData>
						<TableData>{transaction.volume && transaction.volume.toLocaleString()}</TableData>
						<TableData>{formatNumber(transaction.unitfee_usd)}</TableData>
						<TableData>{formatNumber(transaction.totalfee_usd)}</TableData>
						<TableData style={{textAlign: "right"}}>{formatNumber(transaction.totalfee_ngn)}</TableData>
					</TableRow>)
				}

				<TableRow style={{fontWeight: 500}}>
					<TableData colSpan="3">Sub-Total</TableData>
					<TableData>{formatNumber(serviceOneTotalUsd())}</TableData>
					<TableData style={{textAlign: "right"}}>{formatNumber(serviceOneTotalNgn())}</TableData>
				</TableRow>
				</tbody>
			</Table>
			<a href="#" className="text-right justify-end flex text-blue-500">+ Add Transaction</a>
			<SectionTitle>B - Monthly Hosting Fees</SectionTitle>
			<Table>
				<thead>
				<TableRow>
					<TableHeader>Description</TableHeader>
					<TableHeader>Volume</TableHeader>
					<TableHeader>Unit Fee (USD)</TableHeader>
					<TableHeader>Total Fee (USD)</TableHeader>
					<TableHeader>Total Fee (NGN)</TableHeader>
				</TableRow>
				</thead>
				<tbody>
				{
					invoiceData.service2.transactions.map((transaction, index) => <TableRow key={index}>
						<TableData>{transaction.description}</TableData>
						<TableData>{transaction.volume && transaction.volume.toLocaleString()}</TableData>
						<TableData>{formatNumber(transaction.unitfee_usd)}</TableData>
						<TableData>{formatNumber(transaction.totalfee_usd)}</TableData>
						<TableData  style={{textAlign: "right"}}>{transaction.totalfee_ngn ? formatNumber(transaction.totalfee_ngn) : formatNumber((transaction.totalfee_usd * transaction.usd_ngn_rate))}</TableData>
					</TableRow>)
				}
				<TableRow style={{fontWeight: 500}}>
					<TableData colSpan="3">Sub-Total</TableData>
					<TableData>{formatNumber(serviceTwoTotalUsd())}</TableData>
					<TableData style={{textAlign: "right"}}>{formatNumber(serviceTwoTotalNgn())}</TableData>
				</TableRow>
				</tbody>
			</Table>
			<Table>
				<TableRow style={{fontWeight: 500}}>
					<TableData colSpan="5" style={{width: "55%"}}>Total Fee (A + B)</TableData>
					<TableData style={{width: "22%"}}>{formatNumber((serviceOneTotalUsd() + serviceTwoTotalUsd()))}</TableData>
					<TableData style={{textAlign: "right"}}>{formatNumber((serviceOneTotalNgn() + serviceTwoTotalNgn()))}</TableData>
				</TableRow>
				<TableRow style={{fontWeight: 500}}>
					<TableData colSpan="5">VAT</TableData>
					<TableData>{formatNumber((7.5 / 100) * (serviceOneTotalUsd() + serviceTwoTotalUsd()))}</TableData>
					<TableData style={{textAlign: "right"}}>{formatNumber((7.5 / 100) * (serviceOneTotalNgn() + serviceTwoTotalNgn()))}</TableData>
				</TableRow>
				<tfoot>
					<TableRow style={{fontWeight: 500}}>
						<TableData colSpan="5" style={{padding: "8px"}}>GRAND TOTAL in USD</TableData>
						<TableData style={{textAlign: "right"}} colSpan="5">{formatNumber(((7.5 / 100) * (serviceOneTotalUsd() + serviceTwoTotalUsd()) + (serviceOneTotalUsd() + serviceTwoTotalUsd())))}</TableData>
					</TableRow>
					<TableRow style={{fontWeight: 500}}>
						<TableData colSpan="5">GRAND TOTAL in NGN (CBN: N1,592.08/$1)</TableData>
						<TableData style={{textAlign: "right"}} colSpan="5">{formatNumber(((7.5 / 100) * (serviceOneTotalNgn() + serviceTwoTotalNgn()) + (serviceOneTotalNgn() + serviceTwoTotalNgn())))}</TableData>
					</TableRow>
				</tfoot>

			</Table>


		</InvoiceContainer>
	)
}
export default InvoiceDetailsTable