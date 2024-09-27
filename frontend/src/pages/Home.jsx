import React, { useEffect, useState } from 'react';
import { getMessages, editMessage, getMessagesByUser } from '../api';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import SearchBar from '../components/SearchBar';
import EditMessage from '../pages/EditMessage'; 
import '../styles/HomeStyles.css';

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [currentMessageId, setCurrentMessageId] = useState(null);
    const [newText, setNewText] = useState('');
    const [searchUsername, setSearchUsername] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const fetchMessages = async (username = '') => {
        setLoading(true);
        setError(null);
        setSearchError('');

        try {
            const data = username ? await getMessagesByUser(username) : await getMessages();
            console.log('Fetched messages:', data);

            if (username) {
                if (Array.isArray(data) && data.length > 0) {
                    const sortedMessages = data.sort((a, b) => {
                        if (a.username === username) return -1;
                        if (b.username === username) return 1;
                        return 0;
                    });
                    setMessages(sortedMessages);
                } else {
                    setSearchError(`Ingen användare med namnet "${username}" hittades.`);
                    setMessages([]);
                }
            } else {
                setMessages(data);
            }
        } catch (error) {
            setError('Kunde inte hämta meddelanden. Försök igen senare.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (message) => {
        setEditMode(true);
        setCurrentMessageId(message.id);
        setNewText(message.text || '');
    };

    const handleUpdateMessage = async (updatedText) => {
        try {
            await editMessage(currentMessageId, { content: updatedText });
            setMessages(prevMessages =>
                prevMessages.map(message =>
                    message.id === currentMessageId
                        ? { ...message, text: updatedText, updatedAt: new Date().toISOString() }
                        : message
                )
            );
            setEditMode(false);
            setNewText('');
            setCurrentMessageId(null); // Återställ ID
        } catch (error) {
            setError('Kunde inte uppdatera meddelandet. Försök igen senare.');
            console.error('Update error:', error);
        }
    };

    const handleSearch = () => {
        if (!searchUsername.trim()) {
            setSearchError('Du måste fylla i ett användarnamn.');
            return;
        }

        setSearchError('');
        fetchMessages(searchUsername.trim());
        setSearchUsername('');
        setIsSearching(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long' };
        return `den ${date.toLocaleDateString('sv-SE', options)}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        return date.toLocaleTimeString('sv-SE', options).replace(':', ':');
    };

    if (loading) {
        return <div className="loading">Laddar meddelanden...</div>;
    }
    
    return (
        <div className="home-container">
            <h1 className="home-header">Anslagstavla Shui</h1>
            {!editMode && (
                <MessageForm onMessagePosted={fetchMessages} />
            )}
            {!editMode && (
                <SearchBar
                    searchUsername={searchUsername}
                    setSearchUsername={setSearchUsername}
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    handleSearch={handleSearch}
                    searchError={searchError}
                />
            )}
            {editMode ? (
                <EditMessage 
                    selectedMessage={{ id: currentMessageId, content: newText }} 
                    onUpdate={handleUpdateMessage} // Skicka med funktionen som uppdaterar meddelandet
                />
            ) : (
                <MessageList
                    messages={messages}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    onEdit={handleEditClick}
                />
            )}
        </div>
    );
};

export default Home;
