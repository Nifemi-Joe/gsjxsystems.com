import styled from "styled-components";
import Tab from "react-bootstrap/Tab";
import ChevronLeft from "../../assets/images/arrow-drop-right-line.svg";
import ChevronUp from "../../assets/images/arrow-right-up-line-black.svg";
import Loop from "../../assets/images/loop-left-line.svg"
import Tabs from "react-bootstrap/Tabs";
import React, {useContext, useEffect, useRef, useState} from 'react';
import CreateNewTaxForm from "../form/CreateNewTaxForm";
import {Link} from "react-router-dom";
import TaxTable from "../table/TaxTable";
import axios from "axios";
import {DataContext} from "../../context/DataContext";
import {toast} from "react-toastify";
import PaymentModal from "../modal/PaymentModal";
import DatePicker from "react-datepicker";

const TaxContiner = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 16px;
	h3{
        font-weight: 600;
        font-size: 24px;
        color: rgb(25,25,29);
		margin-bottom: 16px;
	}
`
// Main Header for the Tax Section
const SectionHeader = styled.h3`
  font-weight: 600;
  font-size: 24px;
  color: rgb(25, 25, 29);
  margin-bottom: 16px;
`;

// Tax Dashboard for an Overview
const TaxDashboard = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

// Summary of all Taxes
const TaxOverview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background: #f8f8fa;
  padding: 16px;
  border-radius: 8px;

  h4 {
    font-weight: 500;
    font-size: 18px;
    color: rgb(25, 25, 29);
  }

  p {
    color: rgb(140, 151, 172);
    font-size: 14px;
  }
`;

// Activity Section for Recent Transactions and Notifications
const RecentActivity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  background: #f8f8fa;
  padding: 16px;
  border-radius: 8px;

  h4 {
    font-weight: 500;
    font-size: 18px;
    color: rgb(25, 25, 29);
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  p {
    color: rgb(140, 151, 172);
    font-size: 14px;
  }
`;

// Flex Containers for Content Sections
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  h3 {
    font-weight: 500;
    font-size: 18px;
    color: rgb(25, 25, 29);
  }

  span {
    background: #eceff3;
    border-radius: 16px;
    color: rgb(137, 150, 171);
    padding: 4px 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`

const TaxContent = styled.div`
	border: 1px solid rgb(237,237,237);
	border-radius: 8px;
	padding: 16px;
	display: flex;
	width: 60%;
	flex-direction: column;
	gap: 16px;
`

const TabContentHeader = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const TabContentHeaderTop = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	h3{
        font-weight: 500;
        font-size: 18px;
        color: rgb(25,25,29);
		margin: 0;
	}
	span{
		background: #ECEFF3;
		border-radius: 16px;
		color: rgb(137,150,171);
		padding: 4px 8px;
		display: flex;
		align-items: center;
		font-size: 12px;
		gap: 4px;
	}
`

const TabContentHeaderTopText = styled.div`
	color: rgb(137,150,171);
	width: 70%;
	font-size: 13px;
`

const TabContentMiddle = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const TabContentMiddleTop = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 16px;
`

const TabContentMiddleTopContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	color: rgb(25,26,42);
	p{
		
	}
	h2{
		font-size: 16px;
		font-weight: 500;
	}
`

const Seperator = styled.div`
	border: 1px solid #EFF0F4;
	width: 100%;
`

const GreyContainer = styled.div`
	background: rgb(248,248,250);
	border-radius: 8px;
	padding: 16px;
	display: flex;
	gap: 2px;
	flex-direction: column;
	h3{
		color: rgb(25,26,42);
		font-size: 14px;
		font-weight: 500;
		width: 85%;
	}
	p{
		color: rgb(140,151,172);
		font-size: 12px;
	}
	a{
		transition: 0.3s ease-in all;
		cursor: pointer;
		color: rgb(26,164,135) !important;
        font-size: 12px;
		font-weight: 500;
        border-bottom: 2px solid rgb(26,164,135);
		&:hover{
			border-bottom: none;
		}
	}
	div{
		display: flex;
		justify-content: space-between;
	}
`

const ButtonLight = styled.button`
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 8px;
	border: 1px solid rgb(26,164,135);
	color: rgb(26,164,135);
	width: 100%;
	font-size: 12px;
	font-weight: 600;
	transition: all 0.3s ease;
	&:hover{
        background: rgb(26,164,135);
        color: white;
	}
`

const ButtonGreen = styled(ButtonLight)`
	background: rgb(26,164,135);
	color: white;
	border: none;
	&:hover{
        border: 1px solid rgb(26,164,135);
        background: white;
        color: rgb(26,164,135);
	}
`

// Section for Tax Summary Details
const TaxSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-size: 16px;
    font-weight: 500;
    color: rgb(25, 26, 42);
  }

  p {
    font-size: 14px;
    color: rgb(140, 151, 172);
  }
`;

// Container for Filtration and Breakdown Details
const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgb(248, 248, 250);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;

  h3 {
    font-size: 14px;
    font-weight: 500;
    color: rgb(25, 26, 42);
  }

  p {
    font-size: 12px;
    color: rgb(140, 151, 172);
  }
`;

const AsideContainer = styled.aside`
  width: 35%;
  background: #f4f5f7;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
// Styled components
const TaxContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
`;
const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchInput = styled.input`
  padding: 8px;
  font-size: 14px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// const TaxContent = styled.div`
//   border: 1px solid rgb(237,237,237);
//   border-radius: 8px;
//   padding: 16px;
//   display: flex;
//   width: 100%;
//   flex-direction: column;
//   gap: 16px;
// `;
// const QuickLinks = styled.div`
//   background: #ffffff;
//   padding: 16px;
//   border-radius: 8px;
//   box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
//
//   h4 {
//     font-size: 16px;
//     font-weight: 500;
//     color: rgb(25, 26, 42);
//   }
//
//   ul {
//     list-style: none;
//     padding: 0;
//     margin-top: 8px;
//
//     li {
//       font-size: 14px;
//       color: rgb(137, 150, 171);
//       margin-bottom: 8px;
//
//       a {
//         color: rgb(26, 164, 135);
//         text-decoration: none;
//         font-weight: 500;
//
//         &:hover {
//           text-decoration: underline;
//         }
//       }
//     }
//   }
// `;
//
// const TaxTips = styled.div`
//   background: #ffffff;
//   padding: 16px;
//   border-radius: 8px;
//   box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
//
//   h4 {
//     font-size: 16px;
//     font-weight: 500;
//     color: rgb(25, 26, 42);
//   }
//
//   p {
//     font-size: 14px;
//     color: rgb(137, 150, 171);
//     margin-top: 8px;
//   }
// `;
//
// const Resources = styled.div`
//   background: #ffffff;
//   padding: 16px;
//   border-radius: 8px;
//   box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
//
//   h4 {
//     font-size: 16px;
//     font-weight: 500;
//     color: rgb(25, 26, 42);
//   }
//
//   ul {
//     list-style: none;
//     padding: 0;
//     margin-top: 8px;
//
//     li {
//       font-size: 14px;
//       color: rgb(137, 150, 171);
//       margin-bottom: 8px;
//
//       a {
//         color: rgb(26, 164, 135);
//         text-decoration: none;
//         font-weight: 500;
//
//         &:hover {
//           text-decoration: underline;
//         }
//       }
//     }
//   }
// `;
//
// const NewTaxButton = styled(ButtonGreen)`
//   margin-top: 16px;
//   width: 100%;
// `;

const TaxCard = () => {
	const [showForm, setShowForm] = useState(false);
	const [selectedTaxes, setSelectedTaxes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { taxes, setTaxes } = useContext(DataContext);
	const [searchQuery, setSearchQuery] = useState("");  // Search i
	const [selectedDate, setSelectedDate] = useState(null); // Date picker// nput
	const {invoices, clients} = useContext(DataContext);
	const handlePaySelectedTaxes = (selectedTaxIds) => {
		setSelectedTaxes(selectedTaxIds);
		setIsModalOpen(true);
	};
	const findInvoiceClient = (tax) => {
		let invoice = {}
		let client = {
			name: "--"
		}
		if (tax.invoiceNo){
			invoice = invoices.find(c => c.invoiceNo === tax.invoiceNo);
			if (invoice){
				client = clients.find(c => c._id === invoice.clientId);
			}
		}
		console.log(tax);
		console.log(invoice);
		console.log(invoices);
		console.log(client);
		console.log(clients);
		return client.name || "--"
	}
	// const handleSearch = () => {
	// 	let filtered = taxes;
	//
	// 	if (searchTerm) {
	// 		filtered = filtered.filter(
	// 			tax =>
	// 				tax.invoiceNo.includes(searchTerm) ||
	// 				tax.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
	// 		);
	// 	}
	//
	// 	if (startDate && endDate) {
	// 		filtered = filtered.filter(tax => {
	// 			const taxDate = new Date(tax.date);
	// 			return taxDate >= startDate && taxDate <= endDate;
	// 		});
	// 	}
	//
	// 	setFilteredTaxes(filtered);
	// };
	const filteredTaxes = taxes.filter((tax) => {
		const matchesQuery = tax.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(findInvoiceClient(tax).toLowerCase().includes(searchQuery.toLowerCase())) ||
			tax.taxAmountDeducted.toString().includes(searchQuery);

		const matchesDate = selectedDate
			? new Date(tax.date).toDateString() === new Date(selectedDate).toDateString()
			: true;

		return matchesQuery && matchesDate;
	});


	const handleConfirmPayment = async () => {
		try {
			await selectedTaxes.forEach((taxs) => {
				axios.post(`https://tax-app-backend.onrender.com/api/tax/pay/${taxs}`, { id: taxs, status: "paid"});
				toast.success('Payment successful!');
				setIsModalOpen(false);

				// Update the tax status on the frontend
				setTaxes((prevTaxes) =>
					prevTaxes.map((tax) =>
						selectedTaxes.includes(tax._id)
							? { ...tax, status: 'paid' }
							: tax
					)
				);
			})

		} catch (error) {
			console.error('Payment failed:', error);
			toast.error('Payment failed. Please try again.');
		}
	};

	useEffect(() => {
		fetchTaxes();
	}, []);

	const calculateTotalAmount = () => {
		return selectedTaxes.reduce((total, taxId) => {
			const tax = taxes.find((t) => t._id === taxId);
			return total + (tax ? tax.taxAmountDeducted : 0);
		}, 0);
	};
	const handleButtonClick = () => {
		setShowForm(!showForm);
	};
	const [taxType, setTaxType] = useState("All");
	// const [taxes, setTaxes] = useState([]);
	const taxAmount = () => {
		let amount = 0
		taxes.forEach((tax)=> {
			if (tax.status === "unpaid"){
				amount = amount + tax.taxAmountDeducted
			}
		})
		return amount
	}
	const taxAmountPaid = () => {
		let amount = 0
		taxes.forEach((tax)=> {
			if (tax.status === "paid"){
				amount = amount + tax.taxAmountDeducted
			}
		})
		return amount
	}
	const taxAmountPaidVAT = () => {
		let amount = 0
		taxes.forEach((tax)=> {
			if (tax.status === "paid" && (tax.taxType.toLowerCase().includes("vat") || tax.taxType.toLowerCase().includes("value") )){
				amount = amount + tax.taxAmountDeducted
			}
		})
		return amount
	}
	const taxAmountPaidWithHolding = () => {
		let amount = 0
		taxes.forEach((tax)=> {
			if (tax.status === "paid"&& (tax.taxType.toLowerCase().includes("withholding"))){
				amount = amount + tax.taxAmountDeducted
			}
		})
		return amount
	}
	const fetchTaxes = async () => {
		try {
			const response = await axios.get('https://tax-app-backend.onrender.com/api/tax/', {});
			// setTaxes(response.data.responseData)

			// Process the data as needed
		} catch (error) {
			if (error.response) {
				// Server responded with a status other than 2xx
				console.error('Response Error:', error.response.data);
			} else if (error.request) {
				// No response received
				console.error('No Response:', error.request);
			} else {
				// Other errors
				console.error('Error Message:', error.message);
			}
		}
	};
	useEffect(() => {
		fetchTaxes();
	}, []);
	return(
		<TaxContiner>
			{/*<h3>Taxes</h3>*/}
			<SectionHeader>Tax Management System</SectionHeader>
			<FilterContainer>
				<input
					type="text"
					placeholder="Search by client, invoice, or amount"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<DatePicker
					selected={selectedDate}
					onChange={(date) => setSelectedDate(date)}
					placeholderText="Filter by date"
					dateFormat="yyyy-MM-dd"
				/>
			</FilterContainer>
			{/* Dashboard Section */}
			<TaxDashboard>
				{/* Tax Overview Section */}
				<TaxOverview>
					<h4>Tax Overview</h4>
					<p>Total Tax Due: {taxAmount()} NGN</p>
					<p>Taxes Paid: {taxAmountPaid()} NGN</p>
					<p>Upcoming Deadlines: No upcoming deadlines</p>
				</TaxOverview>

				{/* Recent Activity Section */}
				<RecentActivity>
					<h4>Recent Activity</h4>
					<div>
						<p>Payment made for Withholding Tax - {taxAmountPaidWithHolding()} NGN</p>
						<p>Invoice generated for Value Added Tax - {taxAmountPaidVAT()} NGN</p>
						<p>Reminder: VAT filing due on --</p>
					</div>
				</RecentActivity>
			</TaxDashboard>
			{/* Conditionally render the form */}
			{showForm && <CreateNewTaxForm />}

			{
				taxes.length > 0 && <TaxTable taxs={filteredTaxes} clientName={findInvoiceClient} onPay={handlePaySelectedTaxes} />

			}
			<PaymentModal
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				selectedTaxes={selectedTaxes}
				totalAmount={calculateTotalAmount()}
				onConfirmPayment={handleConfirmPayment}
			/>

		</TaxContiner>
	)
}

export default TaxCard