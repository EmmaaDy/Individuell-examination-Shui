// PostMessage.jsx

import React from 'react';
import MessageForm from '../components/MessageForm';

const PostMessage = () => {
    const handleMessagePosted = (newMessage) => {
        // Logik för att hantera ny postade meddelande
        console.log('New message posted:', newMessage);
    };

    return (
        <div>
            <h1>Post a New Message</h1>
            <MessageForm onMessagePosted={handleMessagePosted} />
        </div>
    );
};

export default PostMessage;
