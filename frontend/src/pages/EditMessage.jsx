import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessage, editMessage } from '../api'; // Justera importvägen vid behov

const EditMessage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState({ content: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const fetchedMessage = await getMessage(id);
                setMessage(fetchedMessage);
            } catch (err) {
                console.error('Error fetching message:', err);
                setError('Could not fetch the message.');
            }
        };

        fetchMessage();
    }, [id]);

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const updatedMessage = await editMessage(id, { content: message.content });
            console.log('Message updated:', updatedMessage);
            navigate('/'); // Navigera tillbaka efter redigeringen
        } catch (error) {
            console.error('Error updating message:', error);
            setError('Kunde inte uppdatera meddelandet. Försök igen senare.');
        }
    };

    return (
        <div>
            <h2>Edit Message</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleEdit}>
                <textarea
                    value={message.content}
                    onChange={(e) => setMessage({ content: e.target.value })}
                    required
                />
                <button type="submit">Update Message</button>
            </form>
        </div>
    );
};

export default EditMessage;
