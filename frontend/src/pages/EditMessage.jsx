import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { editMessage } from '../api';
import '../styles/EditMessageStyles.css';

const EditMessage = ({ selectedMessage }) => {
    const navigate = useNavigate();
    const [messageContent, setMessageContent] = useState(selectedMessage.content || '');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleEdit = async (e) => {
        e.preventDefault();

        // Validera att meddelandet inte är tomt
        if (!messageContent.trim()) {
            setError('Meddelandet får inte vara tomt.'); // Sätt felmeddelande
            return; // Avbryt om meddelandet är tomt
        }

        try {
            await editMessage(selectedMessage.id, { content: messageContent });
            setSuccessMessage('Meddelandet har uppdaterats framgångsrikt!');
            setMessageContent('');
            setError(null); // Återställ felmeddelande
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Error updating message:', error);
            setError('Kunde inte uppdatera meddelandet. Försök igen senare.');
        }
    };

    return (
        <div className="edit-message-container">
            <h2 className="edit-message-header">Redigera Meddelande</h2>
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleEdit}>
                <textarea
                    className="edit-message-textarea"
                    value={messageContent}
                    onChange={(e) => {
                        setMessageContent(e.target.value);
                        setError(null); // Återställ felmeddelande när användaren börjar skriva
                    }}
                />
                {error && <p className="edit-error-message">{error}</p>} {/* Ny klass för felmeddelande */}
                <div className="button-group">
                    <button className="save-button" type="submit">Uppdatera Meddelande</button>
                </div>
            </form>
        </div>
    );
};

export default EditMessage;
