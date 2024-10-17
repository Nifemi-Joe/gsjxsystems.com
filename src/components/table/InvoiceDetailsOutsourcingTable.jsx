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
const InvoiceDetailsOutsourcingTable = ({invoiceData}) => {
	const formatNumber = (num) => {
		return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	};

	const rolesTotalNgn = () => {
		let total = 0;
		invoiceData.roles.forEach((transaction)=> {
			total = total + (transaction.unit_fee * transaction.count)
		})
		return total
	}
	return(
		<InvoiceContainer>
			<a href="#" className="text-right justify-end flex text-blue-500">+ Add Role</a>
			<SectionTitle>PERSONNEL OUTSOURCING SERVICE FOR PERIOD: </SectionTitle>
			<Table>
				<thead>
				<TableRow>
					<TableHeader>Role Description</TableHeader>
					<TableHeader>Role Count</TableHeader>
					<TableHeader>Unit Fee ({invoiceData.currency})</TableHeader>
					<TableHeader>Total Fee ({invoiceData.currency})</TableHeader>
				</TableRow>
				</thead>
				<tbody>
				{
					invoiceData.roles.map((transaction, index) => <TableRow key={index}>
						<TableData>{transaction.name}</TableData>
						<TableData>{transaction.count && transaction.count.toLocaleString()}</TableData>
						<TableData>{formatNumber(transaction.unit_fee)}</TableData>
						<TableData style={{textAlign: "right"}}>{formatNumber(transaction.unit_fee * transaction.count)}</TableData>
					</TableRow>)
				}

				<TableRow style={{fontWeight: 500}}>
					<TableData colSpan="3">Sub-Total</TableData>
					<TableData  style={{textAlign: "right"}}>{formatNumber(rolesTotalNgn())}</TableData>
					{/*<TableData style={{textAlign: "right"}}>{formatNumber(rolesTotalNgn())}</TableData>*/}
				</TableRow>
				</tbody>
			</Table>
			<Table>
				<TableRow style={{fontWeight: 500}}>
					<TableData colSpan="5" style={{width: "67%"}}>Total Fee </TableData>
					<TableData style={{width: "20%", textAlign: "right"}}>{formatNumber(rolesTotalNgn())}</TableData>
				</TableRow>
				<TableRow style={{fontWeight: 500}}>
					<TableData colSpan="5">VAT</TableData>
					<TableData style={{textAlign: "right"}}>{formatNumber((7.5 / 100) * (rolesTotalNgn()))}</TableData>
				</TableRow>
				<tfoot>
					<TableRow style={{fontWeight: 500}}>
						<TableData colSpan="5" style={{padding: "8px"}}>GRAND TOTAL in {invoiceData.currency}</TableData>
						<TableData style={{textAlign: "right"}} colSpan="5">{formatNumber(((7.5 / 100) * rolesTotalNgn()) + rolesTotalNgn())}</TableData>
					</TableRow>
				</tfoot>

			</Table>


		</InvoiceContainer>
	)
}
export default InvoiceDetailsOutsourcingTable