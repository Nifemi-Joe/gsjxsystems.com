// CompanyBanner.js
import styled from "styled-components";
import CreateCompanyModal from "../modal/CreateCompanyModal";
import {useState} from "react";

const BannerContainer = styled.div`
    background-color: #f9c74f; // A color for the banner
    color: #000; // Text color
    padding: 15px;
    text-align: center;
    border-radius: 10px;
    margin: 20px 24px;
	
`;

const BannerLink = styled.a`
    color: #000;
    font-weight: bold;
    text-decoration: underline;
`;

const CompanyBanner = () => {
	const [isModalOpen, setModalOpen] = useState(false);

	const handleCreateCompanyClick = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const handleSave = () => {
		// Refresh company list or perform any action needed after saving
	};

	return (
		<BannerContainer>
			<p>
				To access other modules, please <BannerLink href={"#"} onClick={handleCreateCompanyClick}>create a company</BannerLink>.
			</p>
			<CreateCompanyModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} />

		</BannerContainer>
	);
};

export default CompanyBanner;
