// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import QuestionCard from './components/QuestionCard/QuestionCard';

function App() {
    const [role, setRole] = useState(null);

    return (
        <Router>
            
            <Routes>
                <Route path="/login" element={<Login setRole={setRole} />} />
                <Route 
                    path="/user" 
                    element={role === 'user' ? (
                        <div>
                            <Home />
                            <div className="question-list">
                                {/* Hiển thị danh sách câu hỏi */}
                                
                            </div>
                        </div>
                    ) : (
                        <Navigate to="/login" />
                    )}
                />
                <Route 
                    path="/admin" 
                    element={role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} 
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
