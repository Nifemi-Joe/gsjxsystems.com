import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";
import { ColorRing } from "react-loader-spinner";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useAuth} from "../../store/auth/AuthContext";
import CurrencyInput from 'react-currency-input-field';
import ReactCountryFlagsCurrencySelect from "react-country-flag-currency-picker";
import PreviewInvoiceModal from "./PreviewInvoiceModal";
import {DataContext} from "../../context/DataContext";
import ResponseModal from "./ResponseModal";

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
    padding: 16px;
    border-radius: 10px;
    width: 600px;
    max-width: 90%;
	max-height: 80vh;
	height: 680px;
	overflow: scroll;
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

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #555;
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

const TransactionList = styled.div`
  /* Your styles here */
`;

const TransactionTitle = styled.h3`
  /* Your styles here */
	margin-bottom: 8px;
	display: flex;
	align-items: center;
	gap: 16px;
`;

const TransactionFields = styled.div`
  /* Your styles here */
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
`;

const RemoveButton = styled.button`
  /* Your styles here */
    background: #dc3545;
    border: none;
    color: white;
    height: fit-content;
    padding: 10px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
        background: #c82333;
    }
;
`;

const RoleList = styled.div`
  /* Your styles here */
`;

const RoleTitle = styled.h3`
    display: flex;
    align-items: center;
    gap: 16px;
  /* Your styles here */
`;

const RoleItem = styled.div`
  /* Your styles here */
`;

const RoleFields = styled.div`
  /* Your styles here */
	display: flex;
	gap: 8px;
	align-items: center;
`;

const AddTransactionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    background-color: #28a745;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #218838;
    }
`;


const AddRoleButton = styled(AddTransactionButton)`
  /* Your styles here */
`;

const RemoveTransactionButton = styled.button`
  background: #dc3545;
  border: none;
  color: white;
	height: fit-content;
  padding: 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background: #c82333;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
	min-width: 50%;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled(SubmitButton)`
	border: 1px solid #c82333;
	background: #FFFFFF;
	color: #c82333;
    &:hover {
	    color: #FFFFFF;
        background-color: #c82333;
    }
`

const TransactionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
	align-items: center;
  gap: 5px;
`;

const TransactionItem = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
`;


const CreateInvoiceModal = ({ isOpen, onRequestClose, clientData, onSave, type, selectedInvoice, viewMode }) => {
	const { auth, authData, userDetails } = useAuth();
	const [openResponseModal, setOpenResponseModal] = useState(false);
	const [openResponseType, setOpenResponseType] = useState(null);
	const [openResponseMessage, setOpenResponseMessage] = useState('')
	const {rates, vat} = useContext(DataContext)
	const [isPreviewOpen, setPreviewOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [clientsOption, setClients] = useState([]);
	const [formData, setFormData] = useState({
		clientId: type === "edit" ? selectedInvoice.clientId : "",
		transactionDueDate: type === "edit"
			? new Date(selectedInvoice.transactionDueDate).toISOString().split("T")[0] : "",
		amountPaid: type === "edit" ? selectedInvoice.amountPaid : null,
		amountDue: type === "edit" ? selectedInvoice.amountDue : null,
		userId: type === "edit" ? selectedInvoice.userId : "",
		currency: type === "edit" ? selectedInvoice.currency ? selectedInvoice.currency : "NGN" : "USD",
		status: type === "edit" ? selectedInvoice.status : "unpaid",
		invoiceType: type === "edit" ? selectedInvoice.invoiceType : "ACS_RBA",
		rate: rates.length > 0 ? rates[rates.length - 1].value : null,
		companyName: type === "edit" ? selectedInvoice.companyName : "",
		totalInvoiceFee_usd: type === "edit" ? selectedInvoice.totalInvoiceFee_usd : null,
		totalInvoiceFee_ngn: type === "edit" ? selectedInvoice.totalInvoiceFee_ngn : null,
		totalInvoiceFeePlusVat_ngn: type === "edit" ? selectedInvoice.totalInvoiceFeePlusVat_ngn : null,
		totalInvoiceFeePlusVat_usd: type === "edit" ? selectedInvoice.totalInvoiceFeePlusVat_usd : null,

		accountBank: type === "edit" ? selectedInvoice.accountBank : "",
		vat: type === "edit" ? selectedInvoice.vat : null,
		rateDate: type === "edit" ? selectedInvoice.rateDate : "",
		accountName: type === "edit" ? selectedInvoice.accountName : "",
		accountNumber: type === "edit" ? selectedInvoice.accountNumber : "",
		bankName: type === "edit" ? selectedInvoice.bankName : "",
		taxDetailsName: type === "edit" ? selectedInvoice.taxDetailsName : "",
		taxDetailsVatNumber: type === "edit" ? selectedInvoice.taxDetailsVatNumber : "",
		service1: {
			description: type === "edit" ? selectedInvoice.service1.description : "",
			date: type === "edit" ? selectedInvoice.service1.date : "",
			transactions: selectedInvoice?.service1?.transactions?.length > 0
				? selectedInvoice.service1.transactions
				: [{
					description: "",
					volume: null,
					unitfee_usd: null,
					totalfee_usd: null,
					usd_ngn_rate: null,
					totalfee_ngn: null,
				}],
			serviceTotalFeeUsd: type === "edit" ? selectedInvoice.service1.serviceTotalFeeUsd : null,
			serviceTotalFeeNgn: type === "edit" ? selectedInvoice.service1.serviceTotalFeeNgn : null,
		},
		service2: {
			description: type === "edit" ? selectedInvoice.service2.description : "",
			date: type === "edit" ? selectedInvoice.service2.date : "",
			transactions: selectedInvoice?.service2?.transactions?.length > 0
				? selectedInvoice.service2.transactions
				: [{
					description: "",
					volume: null,
					unitfee_usd: null,
					totalfee_usd: null,
					usd_ngn_rate: null,
					totalfee_ngn: null,
				}],
			serviceTotalFeeUsd: type === "edit" ? selectedInvoice.service2.serviceTotalFeeUsd : null,
			serviceTotalFeeNgn: type === "edit" ? selectedInvoice.service2.serviceTotalFeeNgn : null,
		},
		roles: selectedInvoice?.roles?.length > 0
			? selectedInvoice.roles
			: [{
				name: "",
				count: "",
				unit_fee: "",
				total_fee: ""
			}],
		otherInvoiceServices: type === "edit" ? selectedInvoice.otherInvoiceServices : [],
	});
	const handlePreviewOpen = () => {
		setPreviewOpen(true);
	};

	const options = [
		{ value: 'ACS_RBA', label: 'ACS_RBA' },
		{ value: 'OUTSOURCING', label: 'OUTSOURCING' },
		{ value: 'OTHER_INVOICES', label: 'OTHER_INVOICES' }
	];
	const currency = [
		{ value: 'USD', label: 'American Dollar (USD)' },
		{ value: 'NGN', label: 'Nigerian Naira (NGN)' },
		{ value: 'GDP', label: 'British Pounds (GDP)' }
	];
	const {clients} = useContext(DataContext)
	useEffect(() => {
		setFormData({
			clientId: type === "edit" ? selectedInvoice.clientId : "",
			transactionDueDate: type === "edit"
				? new Date(selectedInvoice.transactionDueDate).toISOString().split("T")[0] : "",
			amountPaid: type === "edit" ? selectedInvoice.amountPaid : null,
			amountDue: type === "edit" ? selectedInvoice.amountDue : null,
			userId: type === "edit" ? selectedInvoice.userId : "",
			currency: type === "edit" ? selectedInvoice.currency ? selectedInvoice.currency : "NGN" : "USD",
			status: type === "edit" ? selectedInvoice.status : "unpaid",
			invoiceType: type === "edit" ? selectedInvoice.invoiceType : "ACS_RBA",
			rate: rates.length > 0 ? rates[rates.length - 1].value : null,
			companyName: type === "edit" ? selectedInvoice.companyName : "",
			totalInvoiceFee_usd: type === "edit" ? selectedInvoice.totalInvoiceFee_usd : null,
			totalInvoiceFee_ngn: type === "edit" ? selectedInvoice.totalInvoiceFee_ngn : null,
			accountBank: type === "edit" ? selectedInvoice.accountBank : "",
			vat: type === "edit" ? selectedInvoice.vat : null,
			rateDate: type === "edit" ? selectedInvoice.rateDate : "",
			accountName: type === "edit" ? selectedInvoice.accountName : "",
			accountNumber: type === "edit" ? selectedInvoice.accountNumber : "",
			bankName: type === "edit" ? selectedInvoice.bankName : "",
			taxDetailsName: type === "edit" ? selectedInvoice.taxDetailsName : "",
			taxDetailsVatNumber: type === "edit" ? selectedInvoice.taxDetailsVatNumber : "",
			service1: {
				description: type === "edit" ? selectedInvoice.service1.description : "",
				date: type === "edit" ? selectedInvoice.service1.date : "",
				transactions: selectedInvoice?.service1?.transactions?.length > 0
					? selectedInvoice.service1.transactions
					: [{
						description: "",
						volume: null,
						unitfee_usd: null,
						totalfee_usd: null,
						usd_ngn_rate: null,
						totalfee_ngn: null,
					}],
				serviceTotalFeeUsd: type === "edit" ? selectedInvoice.service1.serviceTotalFeeUsd : null,
				serviceTotalFeeNgn: type === "edit" ? selectedInvoice.service1.serviceTotalFeeNgn : null,
			},
			service2: {
				description: type === "edit" ? selectedInvoice.service2.description : "",
				date: type === "edit" ? selectedInvoice.service2.date : "",
				transactions: selectedInvoice?.service2?.transactions?.length > 0
					? selectedInvoice.service2.transactions
					: [{
						description: "",
						volume: null,
						unitfee_usd: null,
						totalfee_usd: null,
						usd_ngn_rate: null,
						totalfee_ngn: null,
					}],
				serviceTotalFeeUsd: type === "edit" ? selectedInvoice.service2.serviceTotalFeeUsd : null,
				serviceTotalFeeNgn: type === "edit" ? selectedInvoice.service2.serviceTotalFeeNgn : null,
			},
			roles: selectedInvoice?.roles?.length > 0
				? selectedInvoice.roles
				: [{
					name: "",
					count: "",
					unit_fee: "",
					total_fee: ""
				}],
			otherInvoiceServices: type === "edit" ? selectedInvoice.otherInvoiceServices : [],
		})
	}, [selectedInvoice, clients, type])
	useEffect(() => {

		const clientOptions = clients ? clients.map((client) => ({
			value: client._id,
			label: client.name,
		})) : [{value: "", label: "F"}];
		setClients(clientOptions);

	}, [clients]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSelectChange = (selectedOption) => {
		setFormData({
			...formData,
			clientId: selectedOption.value,
		});
	};
	const handleCategorySelectChange = (selectedOption) => {
		setFormData({
			...formData,
			invoiceType: selectedOption.value,
		});
	};
	const handleCurrencySelectChange = (selectedOption) => {
		setFormData({
			...formData,
			currency: selectedOption.value,
		});
	};

	const handleTransactionChange = (serviceKey, transactionIndex, field, value) => {
		setFormData((prevState) => {
			const updatedTransactions = prevState[serviceKey].transactions.map((transaction, idx) => {
				if (idx === transactionIndex) {
					const updatedTransaction = { ...transaction, [field]: value };

					// Recalculate total fees if relevant fields are updated
					if (['volume', 'unitfee_usd', 'usd_ngn_rate'].includes(field)) {
						const volume = parseFloat(updatedTransaction.volume) || 0;
						const unitfee_usd = parseFloat(updatedTransaction.unitfee_usd) || 0;
						const usd_ngn_rate = parseFloat(updatedTransaction.usd_ngn_rate) || 0;

						updatedTransaction.totalfee_usd = volume * unitfee_usd;
						updatedTransaction.totalfee_ngn = updatedTransaction.totalfee_usd * usd_ngn_rate;
					}

					return updatedTransaction;
				}
				return transaction;
			});

			// Recalculate service total fees
			const serviceTotalFeeUsd = updatedTransactions.reduce((sum, txn) => sum + (parseFloat(txn.totalfee_usd) || 0), 0);
			const serviceTotalFeeNgn = updatedTransactions.reduce((sum, txn) => sum + (parseFloat(txn.totalfee_ngn) || 0), 0);

			const updatedService = {
				...prevState[serviceKey],
				transactions: updatedTransactions,
				serviceTotalFeeUsd,
				serviceTotalFeeNgn,
			};

			return {
				...prevState,
				[serviceKey]: updatedService,
			};
		});
	};

	const addTransaction = (serviceKey) => {
		const newTransaction = {
			id: "",
			description: "",
			volume: 1,
			unitfee_usd: 0,
			totalfee_usd: 0,
			usd_ngn_rate: 0,
			totalfee_ngn: 0,
		};

		setFormData((prevState) => {
			const updatedService = {
				...prevState[serviceKey],
				transactions: [...prevState[serviceKey].transactions, newTransaction],
			};
			return {
				...prevState,
				[serviceKey]: updatedService,
			};
		});
	};

	const removeTransaction = (serviceKey, transactionIndex) => {
		setFormData((prevState) => {
			const updatedTransactions = prevState[serviceKey].transactions.filter((_, idx) => idx !== transactionIndex);

			// Recalculate service total fees
			const serviceTotalFeeUsd = updatedTransactions.reduce((sum, txn) => sum + (parseFloat(txn.totalfee_usd) || 0), 0);
			const serviceTotalFeeNgn = updatedTransactions.reduce((sum, txn) => sum + (parseFloat(txn.totalfee_ngn) || 0), 0);

			const updatedService = {
				...prevState[serviceKey],
				transactions: updatedTransactions,
				serviceTotalFeeUsd,
				serviceTotalFeeNgn,
			};

			return {
				...prevState,
				[serviceKey]: updatedService,
			};
		});
	};

	const handleRoleChange = (roleIndex, field, value) => {
		const updatedRoles = [...formData.roles];
		updatedRoles[roleIndex] = {
			...updatedRoles[roleIndex],
			[field]: value,
		};

		setFormData({
			...formData,
			roles: updatedRoles,
		});
	};
	const closeResponseModal = () => {
		if (openResponseType === "error"){
			setOpenResponseModal(false);
		}
		else{
			onRequestClose();
			setOpenResponseModal(false);
		}
	}

	const addRole = () => {
		const newRole = {
			ROLEID: "",
			ROLE_COUNT: 0,
			UNIT_FEE: 0,
			TOTAL_FEE: 0,
		};

		setFormData((prev) => ({
			...prev,
			roles: [...prev.roles, newRole],
		}));
	};

	const removeRole = (roleIndex) => {
		const updatedRoles = formData.roles.filter((_, index) => index !== roleIndex);

		setFormData({
			...formData,
			roles: updatedRoles,
		});
	};

	const handleOtherServiceChange = (serviceIndex, field, value) => {
		const updatedOtherServices = [...formData.otherInvoiceServices];
		updatedOtherServices[serviceIndex] = {
			...updatedOtherServices[serviceIndex],
			[field]: value,
		};

		setFormData({
			...formData,
			otherInvoiceServices: updatedOtherServices,
		});
	};

	const addOtherService = () => {
		const newOtherService = {
			serviceid: "",
			servicename: "",
			servicedescription: "",
			trans_Count: 0,
			unit_Fee: 0,
			total_fee: 0,
		};

		setFormData((prev) => ({
			...prev,
			otherInvoiceServices: [...prev.otherInvoiceServices, newOtherService],
		}));
	};

	const removeOtherService = (serviceIndex) => {
		const updatedOtherServices = formData.otherInvoiceServices.filter(
			(_, index) => index !== serviceIndex
		);

		setFormData({
			...formData,
			otherInvoiceServices: updatedOtherServices,
		});
	};
	const {setInvoices} = useContext(DataContext)
	const handleServiceChange = (serviceKey, field, value) => {
		setFormData((prevState) => ({
			...prevState,
			[serviceKey]: {
				...prevState[serviceKey],
				[field]: value,
			},
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		formData.amountDue = 0;
		try {
			if (type === "add"){
				formData.userId = userDetails._id;
				formData.accountName = "Global SJX Limited";
				formData.accountNumber = "2034738991";
				formData.bankName = "First Bank of Nigeria Limited";
				formData.companyName = "accounts@globalsjxltd.com";
				if (formData.invoiceType === "ACS_RBA"){
					formData.roles = {
						ROLEID: "",
						ROLE_COUNT: null,
						UNIT_FEE: null,
						TOTAL_FEE: null
					}
					formData.service1.description = "AUTHENTICATION FEE FOR PERIOD"
					formData.service2.description = "MONTHLY HOSTING FEE FOR PERIOD"
					formData.rateDate = new Date().toISOString().split('T')[0];
					formData.service1.date = new Date().toISOString().split('T')[0];
					formData.service2.date = new Date().toISOString().split('T')[0];
					formData.service1.transactions.forEach((transaction) => {
						transaction.totalfee_usd = transaction.unitfee_usd * transaction.volume
						transaction.totalfee_ngn = transaction.totalfee_ngn || transaction.totalfee_usd * formData.rate
						formData.service1.serviceTotalFeeNgn = formData.service1.serviceTotalFeeNgn + transaction.totalfee_ngn;
						formData.service1.serviceTotalFeeUsd = formData.service1.serviceTotalFeeUsd + transaction.totalfee_usd;
					})
					formData.service2.transactions.forEach((transaction) => {
						transaction.totalfee_usd = transaction.unitfee_usd * transaction.volume
						transaction.totalfee_ngn = transaction.totalfee_ngn || transaction.totalfee_usd * formData.rate
						formData.service2.serviceTotalFeeNgn = formData.service2.serviceTotalFeeNgn + transaction.totalfee_ngn;
						formData.service2.serviceTotalFeeUsd = formData.service2.serviceTotalFeeUsd + transaction.totalfee_usd;
					})
					formData.amountDue = (calculateServiceOneTotal() + calculateServiceTwoTotal())
					formData.totalInvoiceFee_ngn = (calculateServiceOneTotal() + calculateServiceTwoTotal())
					formData.totalInvoiceFee_usd = (calculateServiceOneTotal() + calculateServiceTwoTotal())
				}
				else if (formData.invoiceType === "OUTSOURCING"){
					formData.service1 = {
						id: "",
						description: "",
						date: null,
						transactions: [{
							id: "",
							description: "",
							volume: null,
							unitfee_usd: null,
							totalfee_usd: null,
							usd_ngn_rate: null,
							totalfee_ngn: null,
						}],
						serviceTotalFeeUsd: null,
						serviceTotalFeeNgn: null
					};
					formData.service2 = {
						id: "",
						description: "",
						date: null,
						transactions: [{
							id: "",
							description: "",
							volume: null,
							unitfee_usd: null,
							totalfee_usd: null,
							usd_ngn_rate: null,
							totalfee_ngn: null,
						}],
						serviceTotalFeeUsd: null,
						serviceTotalFeeNgn: null
					}
					formData.amountDue = calculateRoleTotal()
					formData.totalInvoiceFee_ngn = (formData.vat/100 * calculateRoleTotal()) + calculateRoleTotal();
					formData.totalInvoiceFee_usd = (formData.vat/100 * calculateRoleTotal()) + calculateRoleTotal()

				}
				const token = localStorage.token;
				formData.amountPaid = 0;
				formData.taxDetailsName = "Global SJX Limited"
				formData.taxDetailsVatNumber = "10582697-0001"
				const response = await axios.post("https://tax-app-backend.onrender.com/api/invoices/", formData, {headers: {Authorization: `Bearer ${token}`}});
				if (response.data.responseCode === "00") {
					setOpenResponseType('success');
					setOpenResponseModal(true);
					setOpenResponseMessage('Invoice created successfully!')
					toast.success("Invoice created successfully!", {
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
					const data = await axios.get('https://tax-app-backend.onrender.com/api/invoices/spoolInvoices', {headers: {Authorization: `Bearer ${token}`}})
					setInvoices(data.data.responseData)
					onRequestClose();

				} else {
					toast.error("Failed to create invoice. Please try again.", {
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
				}
			}
			else{
				const response = await axios.put(`https://tax-app-backend.onrender.com/api/invoices/updateInvoice/${selectedInvoice._id}`, formData);
				if (response.data.responseCode === "00") {
					toast.success("Invoice updated successfully!", {
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
					const data = await axios.get('https://tax-app-backend.onrender.com/api/invoices/spoolInvoices', {})
					setInvoices(data.data.responseData)
					onRequestClose();

				}
				else {
					toast.error("Failed to update invoice. Please try again.", {
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
				}
			}

		} catch (error) {
			setOpenResponseType('error');
			setOpenResponseModal(true);
			if (error.response.data && error.response.data.responseMessage && error.response.data.responseMessage.includes('authorized')){
				setOpenResponseMessage('You are not authorized to create invoices.')
			}
			else if(error.response.data.responseMessage){
				setOpenResponseMessage(error.response.data.responseMessage)
			}
			else if (error.response.data.errors){
				setOpenResponseMessage(error.response.data.errors[0].msg);
			}
			else{
				setOpenResponseMessage(error.response.data.message)
			}
			console.error("Error creating invoice:", error);
			toast.error("An error occurred. Please try again.", {
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
			setPreviewOpen(false);
		}
	};

	const calculateTotalNgn = () => {
		let total = 0;
		if (formData.invoiceType === "ACS_RBA"){
			formData.service1.transactions.forEach((transaction) => {
				if (formData.currency === "USD"){
					formData.service1.transactions.forEach((transaction) => {
						if (transaction.unitfee_usd){
							total = total + (transaction.unitfee_usd * transaction.volume)
						}
					})
				}
				else {
					formData.service1.transactions.forEach((transaction) => {
						if (transaction.unitfee_usd){
							total = total + (transaction.unitfee_usd * transaction.volume)
						}
						else {
							total = total + (transaction.totalfee_usd * transaction.usd_ngn_rate)
						}
					})
				}
			})
			formData.service2.transactions.forEach((transaction) => {
				if (formData.currency === "USD"){
					formData.service2.transactions.forEach((transaction) => {
						if (transaction.unitfee_usd){
							total = total + (transaction.unitfee_usd * transaction.volume)
						}
					})
				}
				else {
					formData.service2.transactions.forEach((transaction) => {
						if (transaction.unitfee_usd){
							total = total + (transaction.unitfee_usd * transaction.volume)
						}
						else {
							total = total + (transaction.totalfee_usd * transaction.usd_ngn_rate)
						}
					})
				}
			})
		}
		else if (formData.invoiceType === "OUTSOURCING"){
			formData.roles.map((role)=> {
				total = total + (role.unit_fee * role.count)
			})
		}
		return total;
	}
	const calculateTotalUSD = () => {
		let total = 0;
		if (formData.invoiceType === "ACS_RBA"){
			if (formData.service1.transactions[0].volume !== null) {
				formData.service1.transactions.forEach((transaction) => {
					if (transaction.totalfee_usd){
						total = total + transaction.totalfee_usd
					}
				})
			}
			if (formData.service2.transactions[0].volume !== null) {
				formData.service2.transactions.forEach((transaction) => {
					if (transaction.totalfee_usd){
						total = total + transaction.totalfee_usd
					}
				})
			}

		}
		else if (formData.invoiceType === "OUTSOURCING"){
			formData.roles.map((role)=> {
				total = total + (role.unit_fee * role.count)
			})
		}
		return total;
	}
	const calculateServiceOneTotal = () => {
		let total = 0;
		if (formData.currency === "USD"){
			if (formData.service1.transactions[0].volume !== null) {
				formData.service1.transactions.forEach((transaction) => {
					if (transaction.unitfee_usd){
						total = total + (transaction.unitfee_usd * transaction.volume)
					}
				})
			}

		}
		else {
			if (formData.service1.transactions[0].volume !== null) {
				formData.service1.transactions.forEach((transaction) => {
					if (transaction.unitfee_usd){
						total = total + (transaction.unitfee_usd * transaction.volume)
					}
					else {
						total = total + (transaction.totalfee_usd * transaction.usd_ngn_rate)
					}
				})
			}

		}
		return total;
	}
	const calculateServiceTwoTotal = () => {
		let total = 0;
		if (formData.currency === "USD"){
			if (formData.service2.transactions[0].volume !== null) {
				formData.service2.transactions.forEach((transaction) => {
					if (transaction.unitfee_usd){
						total = total + (transaction.unitfee_usd * transaction.volume)
					}
				})
			}

		}
		else {
			if (formData.service2.transactions[0].volume !== null) {
				formData.service2.transactions.forEach((transaction) => {
					if (transaction.unitfee_usd){
						total = total + (transaction.unitfee_usd * transaction.volume)
					}
					else {
						total = total + (transaction.totalfee_usd * transaction.usd_ngn_rate)
					}
				})
			}

		}
		return total;
	}
	const calculateRoleTotal = () => {
		let total = 0;
		formData.roles.forEach((role)=> {
			if (role.unit_fee){
				total = total + (Number(role.unit_fee) * Number(role.count))
			}
		})
		return total;
	}

	const statusOptions = [
		{value : "paid", label: "Paid"},
		{value : "unpaid", label: "Unpaid"},
		{value : "partial", label: "Partial Payment"},
		{value : "pending", label: "Pending"},
		{value : "inactive", label: "Inactive"},

	]
	return isOpen ? (
		<ModalOverlay>
			<ModalContent>
				<CloseButton onClick={onRequestClose}>×</CloseButton>
				<Title>{type === "add" || viewMode ? "Preview" : "Edit"}</Title>
				<Form>
					{/* Client Selection */}
					<FormGroup>
						<Label>Client</Label>
						<Select
							options={clientsOption}
							value={clientsOption.find((client) => client.value === formData.clientId)}
							onChange={handleSelectChange}
						/>
					</FormGroup>

					{/* Invoice Type */}
					<FormGroup>
						<Label>Invoice Type</Label>
						<Select name="invoiceType" onChange={handleCategorySelectChange} value={options.find((option) => option.value ===  formData.invoiceType)}
							options={options}
						>
						</Select>
					</FormGroup>

					{/* Common Fields */}
					<FormGroup>
						<Label>Transaction Due Date</Label>
						<Input
							type="date"
							name="transactionDueDate"
							value={formData.transactionDueDate}
							onChange={handleChange}
							required
							max={new Date().toISOString().split("T")[0]} // Set max date to today's date
						/>
					</FormGroup>
					<FormGroup>
						<Label>Currency</Label>
						<Select name="currency" onChange={handleCurrencySelectChange} value={currency.find((option) => option.value ===  formData.currency)}
						        options={currency}
						>
						</Select>
					</FormGroup>
					<FormGroup>
						<Label>VAT (%)</Label>
						<Input type="number" name="vat" readOnly={true} value={vat.length > 0 ? vat[0].value : formData.vat} onChange={handleChange} required />
					</FormGroup>

					{/* Conditional Rendering for Invoice Types */}
					{formData.invoiceType === "ACS_RBA" && (
						<>
							{
								formData.currency !== "NGN" && <FormGroup>
									<Label>Rate</Label>
									<Input
										type="number"
										name="rate"
										value={formData.rate}
										onChange={handleChange}
										required
									/>
								</FormGroup>
							}

							{/* Service 1 Transactions */}
							<TransactionList>
								<TransactionTitle><span>Service 1 Transactions</span>{<span className="text-red-600">{calculateServiceOneTotal() > 0 && (`Total: ` + (formData.currency === "NGN" ? "₦" : "$") + calculateServiceOneTotal())}</span>}</TransactionTitle>
								{formData.service1.transactions.map((transaction, index) => (
									<TransactionItem key={index}>
										<TransactionFields>
											<Input
												type="text"
												placeholder="Description"
												value={transaction.description}
												onChange={(e) =>
													handleTransactionChange('service1', index, "description", e.target.value)
												}
												required
											/>
											<div className="flex gap-2">
												<Input
													type="number"
													placeholder="Volume"
													value={transaction.volume}
													onChange={(e) => handleTransactionChange('service1', index, "volume", e.target.value)}													required
													className="w-full"
												/>
												<Input
													type="number"
													placeholder={`Unit Fee (${formData.currency})`}
													value={transaction.unitfee_usd}
													onChange={(e) =>
														handleTransactionChange('service1', index, "unitfee_usd", e.target.value)
													}
													required
													className="w-full"
												/>
											</div>

										</TransactionFields>
										<RemoveButton
											type="button"
											onClick={() => removeTransaction('service1', index)}
										>
											<FaTrash />
										</RemoveButton>
									</TransactionItem>
								))}
								<AddTransactionButton type="button" onClick={() => addTransaction('service1')}>
									<FaPlus /> Add Transaction
								</AddTransactionButton>
							</TransactionList>

							{/* Service 2 Transactions */}
							<TransactionList>
								<TransactionTitle>Service 2 Transactions{<span className="text-red-600">{calculateServiceTwoTotal() > 0 && (`Total: ` + (formData.currency === "NGN" ? "₦" : "$") + calculateServiceTwoTotal())}</span>}</TransactionTitle>
								{formData.service2.transactions.map((transaction, index) => (
									<TransactionItem key={index}>
										<TransactionFields>
											<Input
												type="text"
												placeholder="Description"
												value={transaction.description}
												onChange={(e) =>
													handleTransactionChange('service2', index, "description", e.target.value)
												}
												required
											/>
											<div className="flex gap-2">
												<Input
													type="number"
													placeholder="Volume"
													value={transaction.volume}
													onChange={(e) => handleTransactionChange('service2', index, "volume", e.target.value)}
													required
													className="w-full"
												/>
												<Input
													type="number"
													placeholder={`Unit Fee (${formData.currency})`}
													value={transaction.unitfee_usd}
													onChange={(e) =>
														handleTransactionChange('service2', index, "unitfee_usd", e.target.value)
													}
													required
													className="w-full"
												/>
											</div>

										</TransactionFields>
										<RemoveButton
											type="button"
											onClick={() => removeTransaction('service2', index)}
										>
											<FaTrash/>
										</RemoveButton>
									</TransactionItem>
								))}
								<AddTransactionButton type="button" onClick={() => addTransaction('service2')}>
									<FaPlus /> Add Transaction
								</AddTransactionButton>
							</TransactionList>
						</>
					)}

					{formData.invoiceType === "OUTSOURCING" && (
						<>
							<RoleList>
								<RoleTitle>Roles{<span className="text-red-600">{(`Total: ` + (formData.currency === "NGN" ? "₦" : "$") + calculateRoleTotal())}</span>}</RoleTitle>
								{formData.roles.map((role, index) => (
									<RoleItem key={index} className="mb-2">
										<RoleFields>
											<Input
												type="text"
												placeholder="Role Name"
												value={role.name}
												onChange={(e) =>
													handleRoleChange(index, "name", e.target.value)
												}
												style={{width: "50%"}}
												required
											/>

											<Input
												type="number"
												placeholder="Unit Fee"
												value={role.unit_fee}
												onChange={(e) =>
													handleRoleChange(index, "unit_fee", e.target.value)
												}
												style={{width: "20%"}}

												required
											/>
											<Input
												type="number"
												placeholder="Count"
												value={role.count}
												onChange={(e) =>
													handleRoleChange(index, "count", e.target.value)
												}
												style={{width: "15%"}}

												required
											/>
											<RemoveButton
												type="button"
												onClick={() => removeRole(index)}
											>
												<FaTrash />
											</RemoveButton>
										</RoleFields>
									</RoleItem>
								))}
								<AddRoleButton type="button" onClick={addRole} className="mt-3">
									<FaPlus /> Add Role
								</AddRoleButton>
							</RoleList>
						</>
					)}

					{formData.invoiceType === "OTHER_INVOICES" && (
						<>
							<TransactionList>
								<TransactionTitle>Other Services</TransactionTitle>
								{formData.otherInvoiceServices.map((service, index) => (
									<TransactionItem key={index}>
										<TransactionFields>
											<Input
												type="text"
												placeholder="Service ID"
												value={service.serviceid}
												onChange={(e) =>
													handleOtherServiceChange(index, "serviceid", e.target.value)
												}
												required
											/>
											<Input
												type="text"
												placeholder="Service Name"
												value={service.servicename}
												onChange={(e) =>
													handleOtherServiceChange(index, "servicename", e.target.value)
												}
												required
											/>
											<Input
												type="text"
												placeholder="Service Description"
												value={service.servicedescription}
												onChange={(e) =>
													handleOtherServiceChange(index, "servicedescription", e.target.value)
												}
												required
											/>
											<Input
												type="number"
												placeholder="Transaction Count"
												value={service.trans_Count}
												onChange={(e) =>
													handleOtherServiceChange(index, "trans_Count", e.target.value)
												}
												required
											/>
											<Input
												type="number"
												placeholder="Unit Fee"
												value={service.unit_Fee}
												onChange={(e) =>
													handleOtherServiceChange(index, "unit_Fee", e.target.value)
												}
												required
											/>
											<Input
												type="number"
												placeholder="Total Fee"
												value={service.total_fee}
												onChange={(e) =>
													handleOtherServiceChange(index, "total_fee", e.target.value)
												}
												required
											/>
											<RemoveButton
												type="button"
												onClick={() => removeOtherService(index)}
											>
												<FaTrash />
											</RemoveButton>
										</TransactionFields>
									</TransactionItem>
								))}
								<AddTransactionButton type="button" onClick={addOtherService}>
									<FaPlus /> Add Service
								</AddTransactionButton>
							</TransactionList>
						</>
					)}
					<FormGroup>
						<Label>Status</Label>
						<Select name="status" onChange={(selectedOption) => setFormData({ ...formData, status: selectedOption.value })} value={statusOptions.find((option) => option.value === formData.status.toLowerCase())}
						        options={statusOptions}
						>
						</Select>
					</FormGroup>
					{
						type === "edit" && <FormGroup>
							<Label>Amount Paid ({formData.currency || "NGN"})</Label>
							<Input
								type="number"
								name="amountPaid"
								value={formData.amountPaid}
								onChange={handleChange}
								required
								max={formData.currency === "NGN" ? formData.totalInvoiceFeePlusVat_ngn : formData.totalInvoiceFeePlusVat_usd}
							/>
						</FormGroup>
					}

					{/* Submit Button */}
					{formData.invoiceType === "OUTSOURCING" && <span className="text-red-600">{calculateRoleTotal() > 0 && (`Total: `+ (formData.currency === "NGN" ? "₦" : "$") + (calculateRoleTotal()))}</span>}
					{

						(formData.invoiceType === "" || formData.invoiceType === "ACS_RBA") && (formData.currency === "NGN" || !formData.currency) && <span className="text-red-600">{calculateServiceOneTotal() > 0 && (`Total: ₦` + (calculateServiceOneTotal() + calculateServiceTwoTotal()))}</span>}
					{formData.invoiceType === "" && formData.currency === "USD" && <span className="text-red-600">{calculateTotalUSD() > 0 && (`Total: $` + (calculateServiceOneTotal() + calculateServiceTwoTotal()))}</span>}

					<div className="flex gap-2">
						<CancelButton onClick={onRequestClose}>
							Cancel
						</CancelButton>
						<SubmitButton onClick={handlePreviewOpen}>
							{loading ? "Loading..." : "Preview"}
						</SubmitButton>
					</div>
				</Form>
				<ToastContainer />
			</ModalContent>
			<PreviewInvoiceModal
				type={type}
				isOpen={isPreviewOpen}
				onClose={() => setPreviewOpen(false)}
				formData={formData}
				handleCreateInvoice={handleSubmit}
				calculateServiceOneTotal={calculateServiceOneTotal}
				calculateServiceTwoTotal={calculateServiceTwoTotal}
				calculateRoleTotal={calculateRoleTotal}
				loading={loading}
			/>
			<ResponseModal type={openResponseType} isOpen={openResponseModal} message={openResponseMessage} onClose={closeResponseModal}/>
		</ModalOverlay>
	) : null;
};

export default CreateInvoiceModal;