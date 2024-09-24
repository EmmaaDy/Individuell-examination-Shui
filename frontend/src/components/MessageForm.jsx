// MessageForm.jsx

import React, { useState } from 'react';
import { postMessage } from '../api';

const MessageForm = ({ onMessagePosted }) => {
    // Använda användarnamn och text istället för titel och kropp
    const [username, setUsername] = useState(''); // För användarnamn
    const [text, setText] = useState(''); // För meddelandetext

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMessage = { username, text }; // Skapa meddelandeobjekt
        try {
            const data = await postMessage(newMessage); // Skicka meddelande till API
            onMessagePosted(data); // Anropa callback för att uppdatera listan
            setUsername(''); // Återställ fält
            setText(''); // Återställ fält
        } catch (error) {
            console.error('Error posting message:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username} // Bind användarnamn
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <textarea
                value={text} // Bind meddelandetext
                onChange={(e) => setText(e.target.value)}
                placeholder="Message"
                required
            ></textarea>
            <button type="submit">Post Message</button>
        </form>
    );
};

export default MessageForm;
