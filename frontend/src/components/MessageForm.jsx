import React, { useState } from 'react';
import { postMessage } from '../api';
import '../styles/MessageFormStyles.css';

const MessageForm = ({ onMessagePosted }) => {
    const [username, setUsername] = useState('');
    const [text, setText] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorText, setErrorText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;

        // Rensa tidigare felmeddelanden
        setErrorUsername('');
        setErrorText('');

        // Validera användarnamnet
        if (!username.trim()) {
            setErrorUsername('Användarnamn måste fyllas i.');
            hasError = true;
        } else if (username.trim().length < 3) {
            setErrorUsername('Användarnamnet måste vara minst 3 tecken långt.');
            hasError = true;
        }

        // Validera meddelandetexten
        if (!text.trim()) {
            setErrorText('Meddelande måste fyllas i.');
            hasError = true;
        }

        // Om det finns fel, stoppa inlämningen
        if (hasError) return;

        const newMessage = { username, text };
        try {
            await postMessage(newMessage);
            onMessagePosted();
            setUsername(''); // Återställ användarnamnet efter lyckad inlämning
            setText(''); // Återställ meddelandetexten efter lyckad inlämning
        } catch (error) {
            console.error('Error posting message:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-form">
            <div className="input-container">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Användarnamn.."
                />
                {errorUsername && <div className="error-message">{errorUsername}</div>}
            </div>
            <div className="input-container">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Meddelande.."
                ></textarea>
                {errorText && <div className="error-message">{errorText}</div>}
            </div>
            <button type="submit">Skicka meddelande</button>
        </form>
    );
};

export default MessageForm;
