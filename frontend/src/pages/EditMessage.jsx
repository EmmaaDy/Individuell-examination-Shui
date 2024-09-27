import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditMessageStyles.css';

const EditMessage = ({ selectedMessage, onUpdate }) => {
    const navigate = useNavigate();
    const [messageContent, setMessageContent] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (selectedMessage) {
            setMessageContent(selectedMessage.content || '');
        }
    }, [selectedMessage]);

    const handleEdit = async (e) => {
        e.preventDefault();

        // Validera att meddelandet inte är tomt
        if (!messageContent.trim()) {
            setError('Meddelandet får inte vara tomt.'); // Sätt felmeddelande
            return; // Avbryt om meddelandet är tomt
        }

        // Använd onUpdate-funktionen för att uppdatera meddelandet
        await onUpdate(messageContent);
        setSuccessMessage('Meddelandet har uppdaterats framgångsrikt!');
        setTimeout(() => {
            navigate('/'); // Navigera tillbaka till hemmet efter uppdatering
        }, 2000);
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
                {error && <p className="edit-error-message">{error}</p>}
                <div className="button-group">
                    <button className="save-button" type="submit">Uppdatera Meddelande</button>
                </div>
            </form>
        </div>
    );
};

export default EditMessage;
