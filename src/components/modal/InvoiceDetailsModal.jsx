import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { ColorRing } from "react-loader-spinner";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ImagePicture from "../../assets/images/image-fill.svg";
import Calendar from "../../assets/images/calendar-fill.svg"
import InvoiceDetailsTable from "../table/InvoiceDetailsTable";
import InvoiceDetailsOutsourcingTable from "../table/InvoiceDetailsOutsourcingTable";
import {useAuth} from "../../store/auth/AuthContext";
import {DataContext} from "../../context/DataContext";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 10px;
  width:700px;
	max-height: 80vh;
	height: 700px;
	overflow: scroll;
  max-width: 90%;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s ease-out;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #ff5a5f;
  }
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const InvoiceSection = styled.div`
  margin-top: 2rem;
`;

const InvoiceField = styled.div`
  //margin-bottom: 0.6rem;
`;

const Label = styled.label`
  font-weight: bold;
	font-size: 14px;
`;

const FieldValue = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
	gap: 16px;
  justify-content: end;
  margin-top: 2rem;
	
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
	width: 150px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  color: white;
  background-color: ${(props) => props.bgColor || "#3498db"};
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;


const Input = styled.input`
    padding: 12px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

const ImageLabel = styled.label`
	background: rgb(243, 236, 254);
	border: 1px dashed rgb(150, 79, 254);
	border-radius: 8px;
	color: rgb(116, 29, 255);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	input{
		display: none;
	}
	cursor: pointer;
`

const GreyBackground = styled.div`
	background: rgb(248, 248, 248);
	border-radius: 16px;
	padding: 16px;
	display: flex;
	width: 100%;
	font-size: 14px;
	gap: 8px;
	h3{
		font-weight: 500;
	}
	span{
		color: rgb(99, 0, 255);
	}
`

const InvoiceDetailsModal = ({ isOpen, onClose, invoiceId }) => {
	const [invoiceData, setInvoiceData] = useState({
		invoiceNo: "",
		referenceNumber: ""
	});
	const {setInvoices} = useContext(DataContext);
	const [clients, setClients] = useState([])
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		invoiceNo: invoiceData.invoiceNo,
		referenceNumber: invoiceData.referenceNumber,
		clientId: "",
		transactionDueDate: "",
		amountPaid: Number,
		amountDue: Number,
		userId: "",
		status: "Pending",
		invoiceType: "ACS_RBA",
		rate: Number,
		companyName: "",
		totalInvoiceFee_usd: Number,
		totalInvoiceFee_ngn: Number,
		accountBank: "",
		vat: Number,
		rateDate: "",
		accountName: "",
		accountNumber: "",
		bankName: "",
		taxDetailsName: "",
		taxDetailsVatNumber: "",
		service1: {
			description: String,
			date: Date,
			transactions: [{
				description: String,
				volume: Number,
				unitfee_usd: Number,
				totalfee_usd: Number,
				usd_ngn_rate: Number,
				totalfee_ngn: Number,
			}],
			serviceTotalFeeUsd: Number,
			serviceTotalFeeNgn: Number
		},
		service2: {
			description: String,
			date: Date,
			transactions: [{
				description: String,
				volume: Number,
				unitfee_usd: Number,
				totalfee_usd: Number,
				usd_ngn_rate: Number,
				totalfee_ngn: Number,
			}],
			serviceTotalFeeUsd: Number,
			serviceTotalFeeNgn: Number
		},
		roles: [],
		otherInvoiceServices: []
	});

	const auth = useAuth();
	useEffect(() => {
		if (invoiceId) {
			const fetchInvoiceDetails = async () => {
				try {
					const token = localStorage.token;
					const response = await axios.get(`https://tax-app-backend.onrender.com/api/invoices/printInvoice/${invoiceId}`, {headers: {Authorization: `Bearer ${token}`}});
					setInvoiceData(response.data.responseData);
					const clientResponse = await axios.get(`https://tax-app-backend.onrender.com/api/clients/read-by-clients-id/${response.data.responseData.clientId}`, {headers: {Authorization: `Bearer ${token}`}});
					setClients(clientResponse.data.responseData)
				} catch (error) {
					console.error("Error fetching invoice details", error);
					toast.error("Failed to fetch invoice details", {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "light",
						transition: Bounce,
					});
				} finally {
					setLoading(false);
				}
			};

			fetchInvoiceDetails();
		}
	}, [invoiceId]);

	const handleDownload = async () => {
		try {
			const response = await axios.get(`/api/invoices/${invoiceId}/download`, { responseType: "blob" });
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `Invoice-${invoiceData.invoiceNo}.pdf`);
			document.body.appendChild(link);
			link.click();
		} catch (error) {
			console.error("Error downloading invoice:", error);
		}
	};

	const handleUpdate = async () => {
		try {
			await axios.put(`/api/invoices/${invoiceId}`, { ...invoiceData });
			alert("Invoice updated successfully.");
		} catch (error) {
			console.error("Error updating invoice:", error);
		}
	};
	const handleMenuClose = () => {
		// setAnchorEl(null);
	};

	const handleDelete = async (invoice) => {
		console.log(invoice)

		// Implement delete logic here
		try {
			await axios.post(`https://tax-app-backend.onrender.com/api/invoices/delete/${invoiceId}`, {id: invoiceId});
			const response = await axios.get("https://tax-app-backend.onrender.com/api/invoices/spoolInvoices", {});
			console.log(response.data);

			setInvoices(response.data.responseData);
			onClose();
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
		handleMenuClose();
	};
	const serviceOneTotalNgn = () => {
		let total = 0;
		invoiceData.service1.transactions.map((transaction)=> {
			total = total + transaction.totalfee_ngn
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
	function numberToWords(number) {
		const ones = [
			'', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
			'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
			'Eighteen', 'Nineteen'
		];

		const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

		const scales = ['', 'Thousand', 'Million', 'Billion'];

		const koboPart = number.toFixed(2).split('.')[1]; // Get kobo part
		number = Math.floor(number); // Remove decimal part

		if (number === 0) return 'Zero';

		let words = [];

		// Break the number into groups of 3 digits from the right
		let numString = number.toString();
		let numGroups = Math.ceil(numString.length / 3);
		let numArray = numString.match(/.{1,3}(?=(.{3})*$)/g); // Split into groups of 3 digits

		for (let i = 0; i < numGroups; i++) {
			let group = parseInt(numArray[i]);

			if (group === 0) continue;

			let groupWords = [];

			if (group >= 100) {
				groupWords.push(ones[Math.floor(group / 100)] + ' Hundred');
				group = group % 100;
			}

			if (group >= 20) {
				groupWords.push(tens[Math.floor(group / 10)]);
				group = group % 10;
			}

			if (group > 0) {
				groupWords.push(ones[group]);
			}

			words.push(groupWords.join(' ') + ' ' + scales[numGroups - i - 1]);
		}

		let result = words.join(', ') + ' Naira';

		// Add Kobo part if any
		if (koboPart && koboPart !== '00') {
			result += `, and ${ones[parseInt(koboPart[0])]} ${tens[parseInt(koboPart[1])]} Kobo Only`;
		} else {
			result += ' Only';
		}

		return result;
	}
	const rolesTotalNgn = () => {
		let total = 0;
		invoiceData.roles.forEach((transaction)=> {
			total = total + (transaction.unit_fee * transaction.count)
		})
		return total
	}
	const downloadInvoice = async (invoiceId) => {
		try {
			const response = await fetch(`https://tax-app-backend.onrender.com/api/invoices/downloadInvoice/${invoiceId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/pdf'
				}
			});

			if (!response.ok) {
				throw new Error('Error downloading the invoice');
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `invoice_${invoiceId}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
		} catch (error) {
			console.error('Error:', error);
		}
	};




	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>Invoice Details</Title>
				{loading ? (
					<LoaderWrapper>
						<ColorRing
							visible={true}
							height="80"
							width="80"
							ariaLabel="blocks-loading"
							wrapperStyle={{}}
							wrapperClass="blocks-wrapper"
							colors={["#007bff", "#007bff", "#007bff", "#007bff", "#007bff"]}
						/>
					</LoaderWrapper>
				) : invoiceData ? (
					<InvoiceSection>
						<div className="flex gap-4">
							<div className="w-4/5 flex flex-col gap-2">
								<InvoiceField>
									<FormGroup>
										<Label>Invoice Number:</Label>
										<Input
											type="text"
											name="invoiceNo"
											value={invoiceData.invoiceNo}
											required

										/>
									</FormGroup>
								</InvoiceField>
								<InvoiceField>
									<FormGroup>
										<Label>Reference Number:</Label>
										<Input
											type="text"
											name="referenceNumber"
											value={invoiceData.referenceNumber}
											required
										/>
									</FormGroup>
								</InvoiceField>
								<div className="flex gap-1.5">
									<InvoiceField>
										<FormGroup>
											<Label>Issue Date:</Label>
											<div className="relative">
												<Input
													type="text"
													name="transactionDate"
													value={new Date(invoiceData.transactionDate).toLocaleDateString() || ""}
													required
													style={{paddingLeft: "38px"}}
												/>
												<img src={Calendar} alt="Calendar" className="absolute top-4 left-4"/>
											</div>
										</FormGroup>
									</InvoiceField>
									<InvoiceField>
										<FormGroup>
											<Label>Due Date:</Label>
											<div className="relative">
												<Input
													type="text"
													name="referenceNumber"
													value={new Date(invoiceData.transactionDueDate).toLocaleDateString() || ""}
													required
													style={{paddingLeft: "38px"}}
												/>
												<img src={Calendar} alt="Calendar" className="absolute top-4 left-4"/>
											</div>
										</FormGroup>
									</InvoiceField>
								</div>
							</div>
							<div className="w-2/5">
								<ImageLabel htmlFor="file">
									<img src={ImagePicture} alt="Image"/>
									<span>Add Logo</span>
									<input type="file" id="file"/>
								</ImageLabel>

							</div>
						</div>
						<div className="mt-4">
							<div className="flex justify-between gap-3">
								<div>
									<h2 className="font-semibold mb-2">Bill From</h2>
									<GreyBackground>
										<div className="flex flex-column gap-3">
											<h3>{auth.userDetails.companyName || auth.userDetails.name}</h3>
											<p style={{width: "70%"}}>{auth.userDetails.address || "Enter your address"}</p>
											<p>{auth.userDetails.phone}</p>
											<p>{auth.userDetails.email}</p>
										</div>
									</GreyBackground>
								</div>
								<div>
									<h2 className="font-semibold mb-2">Bill To</h2>
									<GreyBackground>
										<div className="flex flex-column gap-3">
											<h3>{clients.company}</h3>
											<p style={{width: "70%"}}>{clients.address || "Enter company address"}</p>
											<p>{clients.phone}</p>
											<p>{clients.email}</p>
										</div>
									</GreyBackground>
								</div>
							</div>
						</div>
						{
							invoiceData.invoiceType === "ACS_RBA" && <InvoiceDetailsTable invoiceData={invoiceData}/>
						}
						{
							invoiceData.invoiceType === "OUTSOURCING" && <InvoiceDetailsOutsourcingTable invoiceData={invoiceData}/>
						}
						<InvoiceField className="flex-row flex gap-2">
							<Label className="text-nowrap">Amount Due (In words):</Label>
							{
								invoiceData.invoiceType === "ACS_RBA" && <FieldValue className="italic m-0">{numberToWords(((7.5 / 100) * (serviceOneTotalNgn() + serviceTwoTotalNgn()) + (serviceOneTotalNgn() + serviceTwoTotalNgn())))}</FieldValue>
							}
							{
								invoiceData.invoiceType === "OUTSOURCING" && <FieldValue className="italic m-0">{numberToWords(((7.5 / 100) * rolesTotalNgn()) + rolesTotalNgn())}</FieldValue>
							}
						</InvoiceField>
					</InvoiceSection>
				) : (
					<p>No invoice details available.</p>
				)}
				<ButtonGroup>
					<Button bgColor="#2ecc71" onClick={handleUpdate}>
						Update
					</Button>
					<Button bgColor="#e74c3c" onClick={handleDelete}>
						Delete
					</Button>
					<Button bgColor="#3498db" onClick={()=> downloadInvoice(invoiceData._id)}>
						Download
					</Button>
				</ButtonGroup>
			</ModalContent>
		</ModalOverlay>
	);
};

export default InvoiceDetailsModal;
