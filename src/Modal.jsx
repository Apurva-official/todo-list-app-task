import React from 'react';
import './index.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirmation</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-btn">Yes</button>
                    <button onClick={onClose} className="cancel-btn">No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
