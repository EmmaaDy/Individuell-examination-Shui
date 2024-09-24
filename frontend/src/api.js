const BASE_URL = 'https://8ml8eg55tl.execute-api.eu-north-1.amazonaws.com/dev';

// Hämta alla meddelanden
export const getMessages = async (sort = null) => {
    let url = `${BASE_URL}/messages`;
    if (sort) {
        url += `?sort=${sort}`; // Lägger till sorteringsparameter om det finns
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error fetching messages');
    }
    return await response.json();
};

// Hämta meddelanden för en specifik användare
export const getMessagesByUser = async (username) => {
    const response = await fetch(`${BASE_URL}/messages?username=${username}`); // Anpassa endpointen för att ta emot användarnamn
    if (!response.ok) {
        throw new Error('Error fetching messages for user');
    }
    return await response.json();
};

// Hämta ett specifikt meddelande
export const getMessage = async (id) => {
    const response = await fetch(`${BASE_URL}/messages/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching message');
    }
    return await response.json();
};

// Skicka ett nytt meddelande
export const postMessage = async (message) => {
    const response = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    if (!response.ok) {
        throw new Error('Error posting message');
    }
    return await response.json();
};

// Redigera ett meddelande
export const editMessage = async (id, updatedMessage) => {
    try {
        const response = await fetch(`${BASE_URL}/messages/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMessage),
        });
        if (!response.ok) {
            const errorResponse = await response.json(); // Försök att få serverns felmeddelande
            console.error('Server error:', errorResponse);
            throw new Error('Error editing message: ' + (errorResponse.message || 'Unknown error'));
        }
        return await response.json();
    } catch (error) {
        console.error('Error in editMessage:', error);
        throw error; // Skicka vidare felet så att det kan fångas på rätt ställe
    }
};

// Hämta meddelanden sorterade efter datum
export const getMessagesSorted = async () => {
    return getMessages('date'); // Återanvänd getMessages med sorteringsparameter
};
