import React from 'react';
import { Modal, Button } from '@mui/material';

const PaymentModal = ({ open, onClose, selectedTaxes, totalAmount, onConfirmPayment }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', margin: '20px auto', width: '400px' }}>
				<h2>Confirm Payment</h2>
				<p>You have selected {selectedTaxes.length} tax entries for payment.</p>
				<p>Total Amount: <span className="text-red-600">{totalAmount} NGN</span></p>
				<div className="flex gap-2 mt-3">
					<Button variant="contained" color="primary" onClick={onConfirmPayment}>
						Confirm Payment
					</Button>
					<Button variant="outlined" color="secondary" onClick={onClose}>
						Cancel
					</Button>
				</div>

			</div>
		</Modal>
	);
};

export default PaymentModal;
