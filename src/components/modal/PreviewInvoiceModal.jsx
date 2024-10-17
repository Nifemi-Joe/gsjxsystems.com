import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import Calendar from "../../assets/images/calendar-fill.svg";
import ImagePicture from "../../assets/images/image-fill.svg";
import InvoiceDetailsTable from "../table/InvoiceDetailsTable";
import InvoiceDetailsOutsourcingTable from "../table/InvoiceDetailsOutsourcingTable";
import {useAuth} from "../../store/auth/AuthContext";
import {DataContext} from "../../context/DataContext";

// Styled components (same as Invoice Details)
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
  width: 700px;
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
const Form = styled.div`
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

const PreviewInvoiceModal = ({ isOpen, onClose, formData, handleCreateInvoice, calculateRoleTotal, calculateServiceOneTotal, calculateServiceTwoTotal, loading, type }) => {
	const auth = useAuth();
	const {clients} = useContext(DataContext)
	console.log(calculateServiceOneTotal())
	console.log(calculateServiceTwoTotal())

	function numberToWords(number) {
		console.log(number)
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

	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ModalContent>
				<CloseButton onClick={onClose}>
					<FaTimes />
				</CloseButton>
				<Title>Preview Invoice</Title>

				{/* Display invoice data */}
				<InvoiceSection>
					<div className="flex gap-4">
						<div className="w-4/5 flex flex-col gap-2">
							<div className="flex gap-1.5">
								<InvoiceField>
									<FormGroup>
										<Label>Issue Date:</Label>
										<div className="relative">
											<Input
												type="text"
												name="transactionDate"
												value={new Date().toLocaleDateString() || ""}
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
												value={new Date(formData.transactionDueDate).toLocaleDateString() || ""}
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
						<div className="flex gap-3">
							<div>
								<h2 className="font-semibold mb-2">Bill From</h2>
								<GreyBackground>
									<div className="flex flex-column gap-3">
										<h3>{auth.userDetails && (auth.userDetails.companyName || auth.userDetails.name)}</h3>
										<p style={{width: "70%"}}>{auth.userDetails && (auth.userDetails.address || "Enter your address")}</p>
										<p>{ auth.userDetails && auth.userDetails.phone}</p>
										<p>{auth.userDetails && auth.userDetails.email}</p>
									</div>
								</GreyBackground>
							</div>
							<div>
								<h2 className="font-semibold mb-2">Bill To</h2>
								<GreyBackground>
									<div className="flex flex-column gap-3">
										{
											clients.length > 0 && formData.clientId && <div>
												<h3>{clients.find(c => c._id === formData.clientId) ? clients.find(c => c._id === formData.clientId).name : <span className="text-red-600">Deleted Client</span>}</h3>
												<p style={{width: "70%"}}>{clients.find(c => c._id === formData.clientId) ? clients.find(c => c._id === formData.clientId).address : <span className="text-red-600">Enter company address</span>}</p>
												<p>{clients.find(c => c._id === formData.clientId) && clients.find(c => c._id === formData.clientId).phone}</p>
												<p>{clients.find(c => c._id === formData.clientId) && clients.find(c => c._id === formData.clientId).email}</p>
											</div>
										}
									</div>
								</GreyBackground>
							</div>
						</div>
					</div>
					{
						formData.invoiceType === "ACS_RBA" && <InvoiceDetailsTable invoiceData={formData}/>
					}
					{
						formData.invoiceType === "OUTSOURCING" &&
						<InvoiceDetailsOutsourcingTable invoiceData={formData}/>
					}
					<InvoiceField className="flex-row flex gap-2">
						<Label className="text-nowrap">Amount Due (In words):</Label>
						{
							formData.invoiceType === "ACS_RBA" && calculateServiceOneTotal && <FieldValue className="italic m-0">{numberToWords(((7.5 / 100) * (calculateServiceOneTotal() +calculateServiceTwoTotal())) + (calculateServiceOneTotal() + calculateServiceTwoTotal()))}</FieldValue>
						}
						{
							formData.invoiceType === "OUTSOURCING" && <FieldValue className="italic m-0">{numberToWords(((7.5 / 100) * calculateRoleTotal()) + calculateRoleTotal())}</FieldValue>
						}
					</InvoiceField>
				</InvoiceSection>
				{/* Services and more fields */}

				{/* Footer button group */}
				<ButtonGroup>
					<Button bgColor="#2ecc71" onClick={handleCreateInvoice}>{loading ? "Loading..." : type === "add" ? "Create" : "Edit"}</Button>
					<Button bgColor="#e74c3c" onClick={onClose}>Back</Button>
				</ButtonGroup>
			</ModalContent>
		</ModalOverlay>
	);
};

export default PreviewInvoiceModal;
