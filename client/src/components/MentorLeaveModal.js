import React from 'react';
import './MentorLeaveModal.css';

const MentorLeaveModal = ({show, onClose}) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Mentor Has Left</h2>
                <p>The mentor has left the room. You will be redirected to the code block list in 5 seconds.</p>
            </div>
        </div>
    );
};

export default MentorLeaveModal;
