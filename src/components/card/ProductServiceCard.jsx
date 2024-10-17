import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Form, InputGroup, FormControl, Modal } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import Select from 'react-select';

// Container for the entire Product/Service Module
const ProductServiceContainer = styled.div`
    padding: 24px;
	border-radius: 30px;
`;

// Header for Product/Service Module
const ModuleHeader = styled.h3`
    font-weight: 600;
    font-size: 24px;
    color: rgb(25, 25, 29);
    margin-bottom: 24px;
`;

// Container for Product/Service Cards
const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
`;

// Styled Card for Product/Service
const ProductCard = styled(Card)`
    padding: 16px;
	cursor: pointer;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.05);
    }

    h4 {
        font-size: 18px;
        font-weight: 500;
        color: rgb(25, 25, 29);
    }

    p {
        font-size: 14px;
        color: rgb(140, 151, 172);
    }

    .btn-primary {
        background-color: rgb(26, 164, 135);
        border-color: rgb(26, 164, 135);
        &:hover {
            background-color: rgb(24, 147, 121);
            border-color: rgb(24, 147, 121);
        }
    }
`;

// Filter and Search Section
const FilterSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .form-control {
        max-width: 400px;
    }

    .react-select__control {
        width: 250px;
    }
`;

// Modal for Adding/Editing Product/Service
const ProductServiceModal = styled(Modal)`
    .modal-content {
        border-radius: 8px;
    }

    .modal-header {
        border-bottom: none;
        h5 {
            font-size: 20px;
            font-weight: 600;
        }
    }

    .modal-footer {
        border-top: none;
        .btn-primary {
            background-color: rgb(26, 164, 135);
            border-color: rgb(26, 164, 135);
            &:hover {
                background-color: rgb(24, 147, 121);
                border-color: rgb(24, 147, 121);
            }
        }
    }
`;

const ProductServiceCard = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [modalShow, setModalShow] = useState(false);
	const [currentProduct, setCurrentProduct] = useState(null);

	const categories = [
		{ value: 'outsourcing', label: 'Outsourcing' },
		{ value: 'consulting', label: 'Consulting Services' },
		{ value: 'payment-card-security', label: 'Payment Card Security' },
		{ value: 'network-security', label: 'Network Security' },
		{ value: 'performance-monitoring', label: 'Performance Monitoring Tools' },
		{ value: 'training', label: 'Training' }
	];

	const products = [
		{
			id: 1,
			name: 'Outsourcing',
			description: 'High-quality outsourcing services.',
			rating: 4.5
		},
		{
			id: 2,
			name: 'Consulting Services',
			description: 'Expert consulting services.',
			rating: 4.2
		},
		{
			id: 3,
			name: 'Payment Card Security',
			description: 'Secure your payment processes.',
			rating: 4.8
		},
		{
			id: 4,
			name: 'Network Security',
			description: 'Top-notch network security solutions.',
			rating: 4.7
		},
		{
			id: 5,
			name: 'Performance Monitoring Tools',
			description: 'Tools to monitor your performance effectively.',
			rating: 4.3
		},
		{
			id: 6,
			name: 'Training',
			description: 'Professional training services.',
			rating: 4.6
		}
	];

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleCategoryChange = (selectedOption) => {
		setSelectedCategory(selectedOption);
	};

	const handleProductClick = (product) => {
		setCurrentProduct(product);
		setModalShow(true);
	};

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(!selectedCategory || product.name.toLowerCase().includes(selectedCategory.value))
	);

	return (
		<ProductServiceContainer>
			<ModuleHeader>Service Management</ModuleHeader>

			<FilterSection>
				<InputGroup>
					<FormControl
						placeholder="Search Product/Service..."
						value={searchTerm}
						onChange={handleSearch}
					/>
				</InputGroup>
				<Select
					className="w-2/5"
					options={categories}
					placeholder="Filter by Category"
					onChange={handleCategoryChange}
				/>
			</FilterSection>

			<CardContainer>
				{filteredProducts.map((product) => (
					<ProductCard key={product.id} onClick={() => handleProductClick(product)}>
						<Card.Body>
							<h4>{product.name}</h4>
							<p>{product.description}</p>
							<StarRatings
								rating={product.rating}
								starRatedColor="rgb(26, 164, 135)"
								numberOfStars={5}
								starDimension="20px"
								starSpacing="3px"
								name="rating"
							/>
						</Card.Body>
					</ProductCard>
				))}
			</CardContainer>

			<ProductServiceModal show={modalShow} onHide={() => setModalShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>{currentProduct ? currentProduct.name : 'Product/Service Details'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5>{currentProduct?.name}</h5>
					<p>{currentProduct?.description}</p>
					<StarRatings
						rating={currentProduct?.rating || 0}
						starRatedColor="rgb(26, 164, 135)"
						numberOfStars={5}
						starDimension="20px"
						starSpacing="3px"
						name="rating"
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={() => setModalShow(false)}>
						Close
					</Button>
				</Modal.Footer>
			</ProductServiceModal>
		</ProductServiceContainer>
	);
};

export default ProductServiceCard;
