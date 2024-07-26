import React, { useState, ChangeEvent, FormEvent } from 'react';
import { auth } from "../../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Login failed", error);
            });
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <div className='login'>
            <div className='login_container'>
                <h1>Đăng nhập</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <button className="custom__button" type="submit">Đăng nhập</button>
                </form>
                <div className='btn__register'>
                    <p>Chưa có tài khoản vui lòng tạo!</p>
                    <button className="custom__button" onClick={handleRegister}>Đăng ký ngay</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
