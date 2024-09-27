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

    // Hämta alla meddelanden eller filtrera efter användarnamn
    const fetchMessages = async (username = '') => {
        setLoading(true);
        setError(null);
        setSearchError('');

        try {
            const data = username ? await getMessagesByUser(username) : await getMessages();
            console.log('Hämtade meddelanden:', data);

            if (username) {
                if (Array.isArray(data) && data.length > 0) {
                    const sortedMessages = data.sort((a, b) => {
                        return a.username === username ? -1 : 1;
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
            console.error('Fel vid hämtning:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hantera klick på redigeringsknappen
    const handleEditClick = (message) => {
        setEditMode(true);
        setCurrentMessageId(message.id);
        setNewText(message.text || '');
    };

    // Hantera uppdatering av meddelande
    const handleUpdateMessage = async (updatedText) => {
        try {
            // Uppdatera meddelandet via API:et
            await editMessage(currentMessageId, { content: updatedText });
            
            // Uppdatera det lokala tillståndet
            setMessages(prevMessages =>
                prevMessages.map(message =>
                    message.id === currentMessageId
                        ? { ...message, text: updatedText, updatedAt: new Date().toISOString() }
                        : message
                )
            );
            
            // Återställ redigeringsläge och meddelande-ID
            setEditMode(false);
            setNewText('');
            setCurrentMessageId(null);

        } catch (error) {
            setError('Kunde inte uppdatera meddelandet. Försök igen senare.');
            console.error('Fel vid uppdatering:', error);
        }
    };

    // Hantera sökning
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

    // Hämta alla meddelanden vid första laddning
    useEffect(() => {
        fetchMessages();
    }, []);

    // Formatera datum
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long' };
        return `den ${date.toLocaleDateString('sv-SE', options)}`;
    };

    // Formatera tid
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        return date.toLocaleTimeString('sv-SE', options);
    };

    if (loading) {
        return <div className="loading">Laddar meddelanden...</div>;
    }

    return (
        <div className="home-container">
            <h1 className="home-header">Anslagstavla Shui</h1>

            {/* Visa formuläret och sökfältet endast när det inte är redigeringsläge */}
            {!editMode && (
                <>
                    <MessageForm onMessagePosted={fetchMessages} />
                    <SearchBar
                        searchUsername={searchUsername}
                        setSearchUsername={setSearchUsername}
                        isSearching={isSearching}
                        setIsSearching={setIsSearching}
                        handleSearch={handleSearch}
                        searchError={searchError}
                    />
                </>
            )}

            {/* Visa EditMessage-komponenten villkorligt */}
            {editMode ? (
                <EditMessage 
                    selectedMessage={{ id: currentMessageId, content: newText }} 
                    onUpdate={handleUpdateMessage} 
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
