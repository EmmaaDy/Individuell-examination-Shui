// App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PostMessage from './pages/PostMessage';
import EditMessage from './pages/EditMessage';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post-message" element={<PostMessage />} />
                <Route path="/edit-message/:id" element={<EditMessage />} />
            </Routes>
        </Router>
    );
};

export default App;
