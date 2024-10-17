import React, { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f8fa;
  padding: 24px;
  border-radius: 8px;
  margin-top: 24px;
`;

const InputField = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgb(237, 237, 237);
  font-size: 14px;
  color: rgb(25, 25, 29);

  &:focus {
    outline: none;
    border-color: rgb(26, 164, 135);
  }
`;

const SelectField = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgb(237, 237, 237);
  font-size: 14px;
  color: rgb(25, 25, 29);

  &:focus {
    outline: none;
    border-color: rgb(26, 164, 135);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgb(237, 237, 237);
  font-size: 14px;
  color: rgb(25, 25, 29);
  resize: none;

  &:focus {
    outline: none;
    border-color: rgb(26, 164, 135);
  }
`;

const Button = styled.button`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: rgb(26, 164, 135);
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgb(22, 140, 115);
  }
`;

const CreateNewTaxForm = () => {
	const [formData, setFormData] = useState({
		taxName: "",
		taxType: "",
		rate: "",
		description: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic
		console.log("Form submitted:", formData);
	};

	return (
		<FormContainer>
			<h3>Create New Tax</h3>
			<InputField
				type="text"
				name="taxName"
				placeholder="Tax Name"
				value={formData.taxName}
				onChange={handleInputChange}
			/>
			<SelectField
				name="taxType"
				value={formData.taxType}
				onChange={handleInputChange}
			>
				<option value="" disabled>Select Tax Type</option>
				<option value="VAT">VAT</option>
				<option value="Withholding">Withholding</option>
				<option value="Custom">Custom</option>
			</SelectField>
			<InputField
				type="number"
				name="rate"
				placeholder="Rate (%)"
				value={formData.rate}
				onChange={handleInputChange}
			/>
			<TextArea
				name="description"
				placeholder="Description"
				rows="4"
				value={formData.description}
				onChange={handleInputChange}
			/>
			<Button onClick={handleSubmit}>Create</Button>
		</FormContainer>
	);
};

export default CreateNewTaxForm;
