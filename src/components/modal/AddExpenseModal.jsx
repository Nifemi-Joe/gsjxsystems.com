import React, {useContext, useState} from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { ColorRing } from "react-loader-spinner";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import {DataContext} from "../../context/DataContext";
import ResponseModal from "./ResponseModal";
import {useAuth} from "../../store/auth/AuthContext";

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
    padding: 40px;
    border-radius: 10px;
    overflow: scroll;
	max-height: 80vh;
    width: 500px;
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

const SubmitButton = styled.button`
    padding: 12px 20px;
    font-size: 16px;
	min-width: 50%;
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
	border: 1px solid #007bff;
	background: #FFFFFF;
	color: #007bff;
    &:hover {
	    color: #FFFFFF;
        background-color: #007bff;
    }
`

const UploadContainer = styled.div`
    border: 2px dashed #ddd;
    border-radius: 10px;
    padding: 40px;
    text-align: center;
    background-color: #f9f9f9;
    cursor: pointer;
    position: relative;
`;

const UploadText = styled.p`
    font-size: 16px;
    color: #333;
    margin-top: 10px;
`;

const UploadImage = styled.img`
    max-width: 100%;
    border-radius: 10px;
    margin-top: 10px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
`;

// Preview Section Styling
const PreviewSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
`;

const PreviewItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
`;

const PreviewLabel = styled.span`
    font-weight: bold;
`;

const PreviewValue = styled.span`
    color: #555;
`;

const AddExpenseModal = ({ isOpen, onClose }) => {
	const [step, setStep] = useState(1);
	const {userDetails} = useAuth();
	const [expenseImage, setExpenseImage] = useState(null);
	const [receiptImage, setReceiptImage] = useState(null);
	const {setExpenses} = useContext(DataContext);
	const [openResponseModal, setOpenResponseModal] = useState(false);
	const [responseType, setResponseType] = useState('success');
	const [responseMessage, setResponseMessage] = useState('')
	const [loadingExpenseImage, setLoadingExpenseImage] = useState(false);
	const [loadingReceiptImage, setLoadingReceiptImage] = useState(false);
	const [expenseData, setExpenseData] = useState({
		title: "",
		amount: "",
		description: "",
		date: new Date().toISOString().split("T")[0],
		user: "66354091903cc8b8a7a13d62",
		category: "Other",
		image: null,
		receipt: null,
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);

	// Function to handle image upload
	const handleImageUpload = (event, type) => {
		const file = event.target.files[0];
		if (file) {
			if (type === "expenseImage") {
				setLoadingExpenseImage(true);
			} else {
				setLoadingReceiptImage(true);
			}

			setTimeout(() => {
				const imageUrl = URL.createObjectURL(file);
				setExpenseData({ ...expenseData, [type]: imageUrl });
				if (type === "expenseImage") {
					setExpenseImage(imageUrl);
					setLoadingExpenseImage(false);
				} else {
					setReceiptImage(imageUrl);
					setLoadingReceiptImage(false);
				}
			}, 2000);
		}
	};
	const handleClose = () => {
		if (responseType === "success"){
			setOpenResponseModal(false);
			onClose()
		}
		else {
			setOpenResponseModal(false);
		}
	}

	// Function to handle form inputs
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === "amount"){
			setExpenseData({ ...expenseData, [name]: Number(value) });

		}
		else{
			setExpenseData({ ...expenseData, [name]: value });
		}
	};

	// Function to submit the expense
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const token = localStorage.token;
			expenseData.user = userDetails._id
			// Submit expense data to the backend
			const response = await axios.post("https://tax-app-backend.onrender.com/api/expenses/create", expenseData, {headers: {Authorization: `Bearer ${token}`}});
			if (response.data.responseCode === "00") {
				setOpenResponseModal(true);
				setResponseType('success');
				setResponseMessage('Expense added successfully!');
				const data = await axios.get('https://tax-app-backend.onrender.com/api/expenses/read/', {headers: {Authorization: `Bearer ${token}`}})
				setExpenses(data.data.responseData)
				toast.success("Expense added successfully!");
				onClose();
			} else {
				setOpenResponseModal(true);
				setResponseType('error');
				if (response.data.responseMessage && response.data.responseMessage.includes('authorized')){
					setResponseMessage('You are not authorized to create expenses.')
				}
				else if(response.data.responseMessage){
					setResponseMessage(response.data.responseMessage)
				}
				else if (response.data.errors){
					setResponseMessage(response.data.errors[0].msg);
				}
				else{
					setResponseMessage(response.data.message)
				}
				toast.error(response.responseMessage || response.message);
			}
		} catch (err) {
			setOpenResponseModal(true);
			setResponseType('error');
			if (err.response.data.responseMessage && err.response.data.responseMessage.includes('authorized')){
				setResponseMessage('You are not authorized to create invoices.')
			}
			else if(err.response.data.responseMessage){
				setResponseMessage(err.response.data.responseMessage)
			}
			else if (err.response.data.errors){
				setResponseMessage(err.response.data.errors[0].msg);
			}
			else{
				setResponseMessage(err.response.data.message)
			}
			setErrors(err.response.data.errors || ["An error occurred."]);
		} finally {
			setLoading(false);
		}
	};

	// Categories for the select dropdown
	const options = [
		{ value: "Salaries", label: "Salaries" },
		{ value: "Rent", label: "Rent" },
		{ value: "Fueling", label: "Fueling" },
		{ value: "Furnitures", label: "Furnitures" },
		{ value: "Electricity", label: "Electricity" },
		{ value: "Corporate Social Responsibility", label: "Corporate Social Responsibility" },
		{ value: "Training", label: "Training" },
		{ value: "Consulting Services", label: "Consulting Services" },
		{ value: "Software Acquisition", label: "Software Acquisition" },
		{ value: "Travelling", label: "Travelling" },
		{ value: "Office Confectioneries", label: "Office Confectioneries" },
		{ value: "Welfare", label: "Welfare" },
		{ value: "Vehicles", label: "Vehicles" },
		{ value: "Office Equipment", label: "Office Equipment" },
		{ value: "Power Generating Equipment", label: "Power Generating Equipment" },
		{ value: "Others", label: "Others" },

		// Add other categories here...
	];

	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				{
					step < 3 && <Title>Add New Expense</Title>

				}
				{step === 1 ? (
					<Form>
						<FormGroup>
							<Label>Expense Description</Label>
							<Input
								type="text"
								placeholder="Enter expense description"
								name="description"
								required
								onChange={handleInputChange}
								value={expenseData.description}
							/>
						</FormGroup>
						<FormGroup>
							<Label>Amount</Label>
							<Input
								type="number"
								placeholder="Enter amount"
								name="amount"
								required
								onChange={handleInputChange}
								value={expenseData.amount}
							/>
						</FormGroup>
						<FormGroup>
							<Label>Date</Label>
							<Input
								type="date"
								required
								name="date"
								onChange={handleInputChange}
								value={expenseData.date}
								max={new Date().toISOString().split("T")[0]}
							/>
						</FormGroup>
						<FormGroup>
							<Label>Category</Label>
							<Select
								name="category"
								value={options.find(option => option.value === expenseData.category)}
								onChange={(selectedOption) => setExpenseData({ ...expenseData, category: selectedOption.value })}
								required
								options={options}
							/>
						</FormGroup>
						<SubmitButton type="button" onClick={() => setStep(2)}>
							Next
						</SubmitButton>
					</Form>
				) : step === 2 ? (
					<Form>
						<FormGroup>
							<Label>Upload Expense Image</Label>
							<UploadContainer>
								<input
									type="file"
									style={{ display: "none" }}
									onChange={(e) => handleImageUpload(e, "expenseImage")}
									id="expenseImage"
									accept="image/*"
								/>
								<label htmlFor="expenseImage">
									{loadingExpenseImage ? (
										<LoaderWrapper>
											<ColorRing
												visible={true}
												height="80"
												width="80"
												ariaLabel="blocks-loading"
												wrapperStyle={{}}
												wrapperClass="blocks-wrapper"
												colors={["#ffd700", "#ff6347", "#20b2aa", "#4682b4", "#8a2be2"]}
											/>
										</LoaderWrapper>
									) : (
										<>{expenseImage ? <UploadImage src={expenseImage} alt="Expense" /> : <UploadText>Click to upload image</UploadText>}</>
									)}
								</label>
							</UploadContainer>
						</FormGroup>
						<FormGroup>
							<Label>Upload Receipt Image (optional)</Label>
							<UploadContainer>
								<input
									type="file"
									style={{ display: "none" }}
									onChange={(e) => handleImageUpload(e, "receiptImage")}
									id="receiptImage"
									accept="image/*"
								/>
								<label htmlFor="receiptImage">
									{loadingReceiptImage ? (
										<LoaderWrapper>
											<ColorRing
												visible={true}
												height="80"
												width="80"
												ariaLabel="blocks-loading"
												wrapperStyle={{}}
												wrapperClass="blocks-wrapper"
												colors={["#ffd700", "#ff6347", "#20b2aa", "#4682b4", "#8a2be2"]}
											/>
										</LoaderWrapper>
									) : (
										<>{receiptImage ? <UploadImage src={receiptImage} alt="Receipt" /> : <UploadText>Click to upload image</UploadText>}</>
									)}
								</label>
							</UploadContainer>
						</FormGroup>
						<div className="flex gap-2">
							<CancelButton type="button" onClick={() => setStep(1)}>
								Back
							</CancelButton>
							<SubmitButton type="button" onClick={() => setStep(3)}>
								Next
							</SubmitButton>
						</div>
					</Form>
				) : step === 3 ? (
					<PreviewSection>
						<Title>Preview Expense</Title>
						<PreviewItem>
							<PreviewLabel>Description:</PreviewLabel>
							<PreviewValue>{expenseData.description}</PreviewValue>
						</PreviewItem>
						<PreviewItem>
							<PreviewLabel>Amount:</PreviewLabel>
							<PreviewValue>{expenseData.amount}</PreviewValue>
						</PreviewItem>
						<PreviewItem>
							<PreviewLabel>Date:</PreviewLabel>
							<PreviewValue>{expenseData.date}</PreviewValue>
						</PreviewItem>
						<PreviewItem>
							<PreviewLabel>Category:</PreviewLabel>
							<PreviewValue>{expenseData.category}</PreviewValue>
						</PreviewItem>
						<PreviewItem>
							<PreviewLabel>Expense Image:</PreviewLabel>
							<PreviewValue>{expenseImage && <img src={expenseImage} alt="Expense Preview" style={{ width: '100px' }} />}</PreviewValue>
						</PreviewItem>
						<PreviewItem>
							<PreviewLabel>Receipt Image:</PreviewLabel>
							<PreviewValue>{receiptImage && <img src={receiptImage} alt="Receipt Preview" style={{ width: '100px' }} />}</PreviewValue>
						</PreviewItem>
						<div className="flex gap-2">
							<CancelButton type="button" onClick={() => setStep(2)}>
								Edit
							</CancelButton>
							<SubmitButton type="submit" onClick={handleSubmit}>
								{loading ? "Loading..." : "Submit"}
							</SubmitButton>
						</div>
						{/* Navigation buttons */}

					</PreviewSection>
				) : null}
				<ToastContainer />
			</ModalContent>
			<ResponseModal isOpen={openResponseModal} type={responseType} onClose={handleClose} message={responseMessage}/>
		</ModalOverlay>
	);
};

export default AddExpenseModal;
