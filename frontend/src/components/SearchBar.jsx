// SearchBar.jsx
import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ searchUsername, setSearchUsername, isSearching, setIsSearching, handleSearch }) => {
    const [searchError, setSearchError] = useState('');

    // Funktion för att hantera klick på sökknappen
    const handleSearchToggle = () => {
        setIsSearching(prev => !prev);  // Växla isSearching
        if (isSearching) {
            setSearchError(''); // Återställ felmeddelande om sökfältet stängs
        }
    };

    // Hantera sökning och validering
    const handleSearchClick = () => {
        if (!searchUsername) {
            setSearchError('Användarnamnet får inte vara tomt.');
        } else if (searchUsername.length < 3) {  // Kontrollera om användarnamnet är för kort
            setSearchError('Användarnamnet måste vara minst 3 tecken långt.');
        } else {
            setSearchError(''); // Återställ felmeddelande vid en lyckad sökning
            handleSearch(); // Anropa sökfunktionen från props
        }
    };

    return (
        <div className="search-container">
            <div className="search-input-container">
                <button className="search-button" onClick={handleSearchToggle}>
                    <i className="fa fa-search"></i>
                </button>
                
                {/* Visa inputfält och sökknapp bara om isSearching är true */}
                {isSearching && (
                    <>
                        <input
                            type="text"
                            className="home-search-input"
                            value={searchUsername}
                            onChange={(e) => setSearchUsername(e.target.value)}
                            placeholder="Sök efter användarnamn.."
                            id="searchUsernameInput"
                            name="searchUsername"
                        />
                        <button className="home-search-button" onClick={handleSearchClick}>Sök</button>
                    </>
                )}
            </div>

            {isSearching && searchError && (
                <div className="search-error-message">{searchError}</div>
            )}
        </div>
    );
};

export default SearchBar;
