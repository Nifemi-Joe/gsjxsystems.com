import styled from "styled-components";
import Search from "../../assets/images/search-line.svg";
import {Button} from "../table/EnhancedTable";
import Plus from "../../assets/images/add-line.svg";
import {Container} from "./BalanceCard";
import Stack from "../../assets/images/stack-line.svg";
import Draft from "../../assets/images/draft-line.svg";
import Cash from "../../assets/images/exchange-dollar-line.svg";
import CancelIcon from "../../assets/images/close-icon.svg";
import ArrowDown from "../../assets/images/arrow-down-fill.svg";
import Hands from "../../assets/images/hand-coin-line.svg";
import InvoiceTable from "../table/InvoiceTable";
import React, {useContext, useEffect, useMemo, useState} from "react";
import CreateInvoiceModal from "../modal/CreateInvoiceModal";
import {
	AddContainer,
	DownloadButton,
	DownloadContainer,
	DropdownItem,
	DropdownMenu,
	SearchInput
} from "../card/ExpenseCard";
import axios from "axios";
import * as XLSX from "xlsx";
import Add from "../../assets/images/add-line-grey.svg";
import {CSVLink} from "react-csv";
import {DataContext} from "../../context/DataContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RevenueContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 48px;
`;

const ContainerTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ContainerTopLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    h3 {
        font-weight: 600;
        font-size: 18px;
        color: rgb(25, 25, 29);
    }
    p {
        color: rgb(100, 100, 103);
    }
`;

const ContainerTopRight = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    width: 50%;
    justify-content: end;
`;

const PurpleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: rgb(250, 247, 254);
`;

const YellowContainer = styled(PurpleContainer)`
    background: rgb(255, 249, 245);
`;

const GreenContainer = styled(PurpleContainer)`
    background: rgb(242, 254, 253);
`;

const BlueContainer = styled(PurpleContainer)`
    background: rgb(247, 243, 255);
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    h5 {
        font-size: 14px;
        font-weight: 500;
    }
    h2 {
        font-size: 32px;
        font-weight: 600;
    }
`;

const RevenueCard = () => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [type, setType] = useState('add');
	const [selected, setSelected] = useState({});
	const [viewMode, setViewMode] = useState(false)
	const { invoices } = useContext(DataContext);
	const [searchQuery, setSearchQuery] = useState("");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const handleOpenModal = () => {
		setType('add')
		setModalOpen(true)
	};
	const handleCloseModal = () => setModalOpen(false);
	const handleDownloadClick = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const changeViewMode = (value) => {
		setViewMode(value)
	}



	const fetchInvoices = async () => {
		try {
			const token = localStorage.token;
			const response = await axios.get('https://tax-app-backend.onrender.com/api/invoices/spoolInvoices', {headers: {Authorization: `Bearer ${token}`}});
			// setInvoices(response.data.responseData)

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
		fetchInvoices();
	}, []);
	const csvData = invoices.map((invoice, index) => ({
		ID: String(index + 1).padStart(3, '0'), // 001, 002, 003 format
		Invoice_No: invoice.invoiceNo,
		Reference_No: invoice.referenceNumber,
		Client_ID: invoice.clientId,
		Transaction_Date: new Date(invoice.transactionDate).toLocaleDateString(),
		Transaction_Due_Date: new Date(invoice.transactionDueDate).toLocaleDateString(),
		Amount_Paid: invoice.amountPaid,
		Amount_Due: invoice.amountDue,
		Status: invoice.status,
		Invoice_Type: invoice.invoiceType,
		Company_Name: invoice.companyName,
		Service1_Total_Fee_NGN: invoice.service1 ? invoice.service1.serviceTotalFeeNgn : 'N/A',
		Service2_Total_Fee_NGN: invoice.service2 ? invoice.service2.serviceTotalFeeNgn : 'N/A',
		Roles: invoice.roles.map(role => `${role.name} (${role.count} @ ${role.unit_fee})`).join('; '), // e.g., Software Developer (2 @ 700000); Business Analyst (1 @ 750000)
		Total_Invoice_Fee_NGN: invoice.totalInvoiceFee_ngn,
		VAT: invoice.vat,
		Total_Invoice_Fee_Plus_VAT_NGN: invoice.totalInvoiceFeePlusVat_ngn,
		Rate_Date: new Date(invoice.rateDate).toLocaleDateString(),
		Account_Name: invoice.accountName,
		Account_Number: invoice.accountNumber,
		Bank_Name: invoice.bankName,
		Currency: invoice.currency,
		Tax_Details_Name: invoice.taxDetailsName,
		Tax_Details_VAT_Number: invoice.taxDetailsVatNumber,
		Created_At: new Date(invoice.createdAt).toLocaleDateString(),
		Updated_At: new Date(invoice.updatedAt).toLocaleDateString(),
	}));

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(csvData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
		XLSX.writeFile(workbook, "Invoices.xlsx");
	};

	const totalExpected = () => {
		let total = 0
		invoices.forEach((invoice) => {
			if (invoice.status.toLowerCase() !== "canceled"){
				total = total + invoice.totalInvoiceFee_ngn
			}
		})
		return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}

	const totalPaid = () => {
		let total = 0
		invoices.forEach((invoice) => {
			if (invoice.status.toLowerCase() !== "canceled"){
				total = total + invoice.amountPaid
			}
		})
		return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}

	const totalUnpaid = () => {
		let paidtotal = 0
		let total = 0
		invoices.forEach((invoice) => {
			if (invoice.status.toLowerCase() !== "canceled"){
				paidtotal = paidtotal + invoice.amountPaid
				total = total + invoice.totalInvoiceFee_ngn
			}
		})
		return (total - paidtotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	}
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const filteredRows = useMemo(() => {
		return invoices.filter((invoice) => {
			const invoiceDate = new Date(invoice.transactionDate);
			return (
				(!startDate || invoiceDate >= new Date(startDate)) &&
				(!endDate || invoiceDate <= new Date(endDate)) &&
				(invoice._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					invoice.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					invoice.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					invoice.companyName?.toLowerCase().includes(searchQuery.toLowerCase()))
			);
		});
	}, [searchQuery, invoices, startDate, endDate]);

	const handleEdit = (invoice) => {
		setType('edit');
		setSelected(invoice);
		setModalOpen(true)
	}
	return (
		<RevenueContainer>
			<ContainerTop>
				<ContainerTopLeft>
					<h3>Invoices</h3>
					<p>Review, approve and pay invoices</p>
				</ContainerTopLeft>
				<ContainerTopRight style={{width: "70%"}}>
					<div className="relative w-3/5">
						<SearchInput
							placeholder="Search & Filter"
							value={searchQuery}
							onChange={handleSearchChange}
						/>
						<img src={Search} alt="Search" className="absolute top-2.5 left-3"/>
					</div>
					<AddContainer onClick={handleOpenModal}>
						<img src={Add} alt="Add"/>
					</AddContainer>
					<DownloadContainer>
						<DownloadButton  style={{minHeight: "35px"}} isActive={isDropdownOpen} onClick={handleDownloadClick}>
							<img src={isDropdownOpen ? CancelIcon : ArrowDown} alt="Download"/>
						</DownloadButton>
						<DropdownMenu isOpen={isDropdownOpen}>
							<CSVLink data={csvData} filename={"Invoices.csv"}>
								<DropdownItem>Download as CSV</DropdownItem>
							</CSVLink>
							<DropdownItem href="#" onClick={exportToExcel}>Download as Excel</DropdownItem>
						</DropdownMenu>
					</DownloadContainer>
					<div className="flex gap-4">
						<DatePicker
							selected={startDate}
							onChange={(date) => setStartDate(date)}
							placeholderText="Start Date"
							className="form-control"
						/>
						<DatePicker
							selected={endDate}
							onChange={(date) => setEndDate(date)}
							placeholderText="End Date"
							className="form-control"
						/>
					</div>

				</ContainerTopRight>
			</ContainerTop>

			{/* Date Range Picker */}

			{/* Summary */}
			<div className="flex justify-between gap-3">
				<Container>
					<PurpleContainer>
						<img src={Stack} alt="Stack"/>
					</PurpleContainer>
					<TextContainer>
						<h3>Total Invoices</h3>
						<h2>{invoices.length}</h2>
					</TextContainer>
				</Container>
				<Container>
					<YellowContainer>
						<img src={Draft} alt="Draft" />
					</YellowContainer>
                    <TextContainer>
                        <h3>Total Expected</h3>
                        <h2>₦{totalExpected()}</h2>
                    </TextContainer>
                </Container>
                <Container>
                    <GreenContainer>
                        <img src={Cash} alt="Cash" />
                    </GreenContainer>
                    <TextContainer>
                        <h3>Total Paid</h3>
                        <h2>₦{totalPaid()}</h2>
                    </TextContainer>
                </Container>
                <Container>
                    <BlueContainer>
                        <img src={Hands} alt="Hands" />
                    </BlueContainer>
                    <TextContainer>
                        <h3>Total Unpaid</h3>
                        <h2>₦{totalUnpaid()}</h2>
                    </TextContainer>
                </Container>
            </div>

            {/* Table */}
            <InvoiceTable invoices={filteredRows} handleEdit={handleEdit} changeViewMode={changeViewMode} />

            <CreateInvoiceModal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)} type={type} selectedInvoice={selected} viewMode={viewMode}/>
        </RevenueContainer>
    );
};

export default RevenueCard;
