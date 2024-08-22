import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Footer from './components/Footer/Footer';

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
                        </div>
                    ) : (
                        <Navigate to="/login" /> 
                    )}
                />
                
                <Route 
                    path="/admin" 
                    element={role === 'admin' ? (
                        <AdminPanel />
                    ) : (
                        <Navigate to="/login" /> // Nếu không có role 'admin', điều hướng về /login
                    )}
                />

                <Route path="*" element={<Navigate to="/login" />} /> {/* Điều hướng tất cả các trang không tồn tại đến /login */}
            </Routes>
        </Router>
    );
}

export default App;
