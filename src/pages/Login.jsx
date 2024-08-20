import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import amazingTechImg from '../assets/AmazingTech.png'; // Import hình ảnh

const Login = ({ setRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy dữ liệu người dùng từ API
        fetch('https://66c3f496b026f3cc6ced9351.mockapi.io/Quyen')
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Kiểm tra dữ liệu trả về từ API
                setUsers(data);
            })
            .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
    }, []);

    const handleLogin = () => {
        const user = users.find(
            (u) => u.username.trim() === username.trim() && u.password.trim() === password.trim()
        );

        if (user) {
            if (user.Quyen === 1) {
                setRole('user');
                navigate('/user');
            } else if (user.Quyen === 2) {
                setRole('admin');
                navigate('/admin');
            }
        } else {
            alert('Sai thông tin đăng nhập!');
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <img src={amazingTechImg} alt="Amazing Tech Logo" className="login-logo" />
                <h2 className="login-title">Đăng nhập</h2>
            </div>
            <div className="login-form">
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <button onClick={handleLogin} className="login-button">
                    Đăng nhập
                </button>
            </div>
        </div>
    );
};

export default Login;
