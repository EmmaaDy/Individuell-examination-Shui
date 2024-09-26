// MessageList.jsx
import React from 'react';
import '../styles/MessageListStyles.css';

const MessageList = ({ messages, formatDate, formatTime, onEdit, isLoading }) => {
    return (
        <ul className={`message-list ${isLoading ? 'loading' : ''}`}>
            {isLoading ? (
                <li className="message-list-loading">Laddar meddelanden...</li>
            ) : messages.length === 0 ? (
                <li className="home-message-item">Inga meddelanden att visa.</li>
            ) : (
                messages.map(message => (
                    <li key={message.id} className="home-message-item">
                        <div className="message-content">
                            {/* Datum i övre vänstra hörnet */}
                            <small className="home-timestamp">
                                {formatDate(message.createdAt)} {formatTime(message.createdAt)}
                                {message.updatedAt ? ` (Uppdaterad ${formatDate(message.updatedAt)} ${formatTime(message.updatedAt)})` : ''}
                            </small>

                            {/* Meddelandetext i mitten */}
                            <p className="home-message-text">{message.text}</p>

                            {/* Användarnamn under texten */}
                            <span className="home-username">- {message.username}</span>
                        </div>

                        {/* Redigeringsknappen längst ut till höger */}
                        <button className="home-edit-button" onClick={() => onEdit(message)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                    </li>
                ))
            )}
        </ul>
    );
};

export default MessageList;
