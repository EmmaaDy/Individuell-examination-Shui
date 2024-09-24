import React, { useEffect, useState } from 'react';
import { getMessages, editMessage, getMessagesByUser } from '../api';

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [currentMessageId, setCurrentMessageId] = useState(null);
    const [newText, setNewText] = useState('');
    const [searchUsername, setSearchUsername] = useState(''); // För sökning

    const fetchMessages = async (username = '') => {
        setLoading(true);
        try {
            const data = username ? await getMessagesByUser(username) : await getMessages();
            console.log('Fetched messages:', data);
            
            // Filtrera och sortera meddelanden så att matchande användarnamn kommer först
            const sortedMessages = data.sort((a, b) => {
                if (a.username === username) return -1; // Flytta matchande användarnamn först
                if (b.username === username) return 1; // Flytta andra matchande användarnamn efter
                return 0; // Behåll övriga i nuvarande ordning
            });

            setMessages(sortedMessages);
        } catch (error) {
            setError('Kunde inte hämta meddelanden. Försök igen senare.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (message) => {
        setEditMode(true);
        setCurrentMessageId(message.id);
        setNewText(message.text || '');
    };

    const handleUpdateMessage = async () => {
        console.log('Updating message with ID:', currentMessageId);
        console.log('New text:', newText);
        try {
            await editMessage(currentMessageId, { content: newText });
            // Uppdatera meddelandet lokalt
            setMessages(prevMessages => 
                prevMessages.map(message => 
                    message.id === currentMessageId 
                    ? { ...message, text: newText, updatedAt: new Date().toISOString() } 
                    : message
                )
            );
            setEditMode(false);
            setNewText('');
        } catch (error) {
            setError('Kunde inte uppdatera meddelandet. Försök igen senare.');
            console.error('Update error:', error);
        }
    };

    const handleSearch = () => {
        fetchMessages(searchUsername); // Anropa fetchMessages med det angivna användarnamnet
        setSearchUsername(''); // Nollställ söktexten efter sökningen
    };

    useEffect(() => {
        fetchMessages(); // Anropar bara en gång när komponenten monteras
    }, []);

    if (loading) {
        return <div>Laddar meddelanden...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={fetchMessages}>Försök igen</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Messages</h1>
            <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Sök efter användarnamn"
            />
            <button onClick={handleSearch}>Sök</button>
            {editMode ? (
                <div>
                    <input
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                    />
                    <button onClick={handleUpdateMessage}>Uppdatera meddelande</button>
                    <button onClick={() => setEditMode(false)}>Avbryt</button>
                </div>
            ) : (
                <ul>
                    {messages.map(message => (
                        <li key={message.id} className="message-item">
                            <strong>{message.username}:</strong> {message.text} <br />
                            <small className="timestamp">
                                {new Date(message.createdAt).toLocaleString()}
                                {message.updatedAt ? ` (Uppdaterad ${new Date(message.updatedAt).toLocaleString()})` : ''}
                            </small>
                            <button onClick={() => handleEditClick(message)}>Redigera</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;
