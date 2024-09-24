// MessageItem.jsx

import React from 'react';

const MessageItem = ({ message }) => {
    return (
        <div className="message-item">
            <h3>{message.title}</h3>
            <p>{message.body}</p>
        </div>
    );
};

export default MessageItem;
