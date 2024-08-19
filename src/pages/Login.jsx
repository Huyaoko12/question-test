import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import AmazingTechLogo from '../assets/AmazingTech.png';  // Đường dẫn chính xác từ thư mục pages đến assets

const Login = ({ setRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin123') {
            setRole('admin');
            navigate('/admin');
        } else if (username === 'user' && password === 'user123') {
            setRole('user');
            navigate('/user');
        } else {
            alert('Sai thông tin đăng nhập!');
        }
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                <img src={AmazingTechLogo} alt="AmazingTech Logo" />
            </div>
            <h2 className="login-title">Đăng nhập</h2>
            <div className="login-form">
                <input
                    type="text"
                    className="login-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="login-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login-button" onClick={handleLogin}>Đăng nhập</button>
            </div>
        </div>
    );
};

export default Login;
