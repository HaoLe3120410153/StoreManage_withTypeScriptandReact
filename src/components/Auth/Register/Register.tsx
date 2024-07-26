import React, { useState, ChangeEvent, FormEvent } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import './Register.css';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'users/' + user.uid), {
                email: user.email,
                uid: user.uid,
                password: password,
                address: address,
                admin: false,
                isNew: true,
            });

            navigate('/login');
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleToLogin = () => {
        navigate('/login');
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    return (
        <div className='register'>
            <div className="register-container">
                <h1>Đăng Ký</h1>
                <form onSubmit={handleRegister}>
                    <div>
                        <label >Email:</label>
                        <input type="email" value={email} onChange={handleEmailChange} required />
                    </div>
                    <div>
                        <label>Địa Chỉ:</label>
                        <input type="text" value={address} onChange={handleAddressChange} required />
                    </div>
                    <div>
                        <label>Mật Khẩu:</label>
                        <input type="password" value={password} onChange={handlePasswordChange} required />
                    </div>
                    <div>
                        <label>Nhập lại Mật Khẩu:</label>
                        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button className="custom__button" type="submit">Đăng Ký</button>
                </form>
                <div className='btn_back_tologin'>
                    <p>Đã có tài khoản</p>
                    <button className="custom__button" onClick={handleToLogin}>Trở về trang đăng nhập</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
