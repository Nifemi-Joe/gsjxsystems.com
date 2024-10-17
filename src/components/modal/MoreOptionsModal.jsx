import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import USA from "../../assets/images/united states.svg";
import Nigeria from "../../assets/images/nigeria.svg";
import CloseIcon from "../../assets/images/close-icon.svg"; // Add a close icon for the modal
import ChevronDown from"../../assets/images/arrow-drop-down-line.svg";

// Styled Components for the Modal
const ModalWrapper = styled.div`
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
    width: 500px;
    max-width: 90%;
	height: auto;
	max-height: 80vh;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.4s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.img`
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

const CurrencySection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
	gap: 16px;
`;

const CurrencyOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${(props) => (props.active ? '#F1F3F5' : 'white')};
  border: ${(props) => (props.active ? '2px solid #4182F9' : '1px solid #D7D8DC')};
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4182F9;
  }
`;

const OptionText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
`;

const FilterButton = styled.button`
  background-color: ${(props) => (props.active ? '#4182F9' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#2E3A59')};
  padding: 10px 20px;
  border: ${(props) => (props.active ? 'none' : '1px solid #D7D8DC')};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#316AC9' : '#F1F3F5')};
  }
`;

const SaveButton = styled.button`
  background-color: #4182F9;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;

  &:hover {
    background-color: #316AC9;
  }
`;

const MoreOptionsModal = ({ isOpen, onRequestClose, handleCurrencyChange, handleFilterChange, currency, filter }) => {

	const handleSave = () => {
		// Save or apply logic here
		// console.log(`Selected currency: ${currency}, Filter: ${filter}`);
		onRequestClose();
	};
	if (!isOpen) return null;
	return (
		<ModalWrapper
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			ariaHideApp={false}
		>
			<ModalContent>
				<ModalHeader>
					<Title>Change Currency & Filter</Title>
					<CloseButton src={CloseIcon} alt="Close" onClick={onRequestClose} />
				</ModalHeader>

				<CurrencySection>
					<CurrencyOption
						active={currency === 'USD'}
						onClick={() => handleCurrencyChange('USD')}
					>
						<img src={USA} alt="USA" />
						<OptionText>USD</OptionText>
					</CurrencyOption>
					<CurrencyOption
						active={currency === 'NGN'}
						onClick={() => handleCurrencyChange('NGN')}
					>
						<img src={Nigeria} alt="Nigeria" />
						<OptionText>NGN</OptionText>
					</CurrencyOption>
				</CurrencySection>

				<FilterSection>
					<FilterButton
						active={filter === 'monthly'}
						onClick={() => handleFilterChange('monthly')}
					>
						Monthly
					</FilterButton>
					<FilterButton
						active={filter === 'yearly'}
						onClick={() => handleFilterChange('yearly')}
					>
						Yearly
					</FilterButton>
				</FilterSection>

				<SaveButton onClick={handleSave}>Save Changes</SaveButton>
			</ModalContent>
		</ModalWrapper>
	);
};

export default MoreOptionsModal;
