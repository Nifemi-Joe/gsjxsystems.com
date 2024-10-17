import React, { useState } from "react";
import styled from "styled-components";

const CalculatorContainer = styled.div`
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

const ResultField = styled.div`
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-size: 16px;
  color: rgb(25, 25, 29);
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

const TaxCalculator = () => {
	const [income, setIncome] = useState("");
	const [taxRate, setTaxRate] = useState("");
	const [totalTax, setTotalTax] = useState(null);

	const handleCalculate = () => {
		const calculatedTax = (income * taxRate) / 100;
		setTotalTax(calculatedTax);
	};

	return (
		<CalculatorContainer>
			<h3>Tax Calculator</h3>
			<InputField
				type="number"
				name="income"
				placeholder="Enter your income"
				value={income}
				onChange={(e) => setIncome(e.target.value)}
			/>
			<SelectField
				name="taxRate"
				value={taxRate}
				onChange={(e) => setTaxRate(e.target.value)}
			>
				<option value="" disabled>Select Tax Rate</option>
				<option value="7.50">Value Added Tax (7.50%)</option>
				<option value="5">Withholding Tax 1 (5%)</option>
				<option value="10">Withholding Tax 2 (10%)</option>
				<option value="Custom">Custom</option>
			</SelectField>

			{taxRate === "Custom" && (
				<InputField
					type="number"
					name="customRate"
					placeholder="Enter custom tax rate (%)"
					value={taxRate}
					onChange={(e) => setTaxRate(e.target.value)}
				/>
			)}

			<Button onClick={handleCalculate}>Calculate Tax</Button>

			{totalTax !== null && (
				<ResultField>
					Total Tax: {totalTax} USD
				</ResultField>
			)}
		</CalculatorContainer>
	);
};

export default TaxCalculator;
