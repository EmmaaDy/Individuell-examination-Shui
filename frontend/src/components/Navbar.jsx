import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/Navbar.css';


const Navbar = () => {
    const handleHomeClick = () => {
        // Uppdatera sidan
        window.location.reload();
    };

    return (
        <nav>
            <ul>
                <li>
                    <button onClick={handleHomeClick} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <i className="fa fa-home"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
