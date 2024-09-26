import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';  

import Navbar from './components/Navbar';  
import Home from './pages/Home';
import EditMessage from './pages/EditMessage';

import './styles/Navbar.css';  
import './styles/global.css';
import './styles/EditMessageStyles.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                {/* Uppdatera här för att inkludera messageId */}
                <Route path="/edit-message/:username/:messageId" element={<EditMessage />} /> 
            </Routes>
        </Router>
    );
};

export default App;
