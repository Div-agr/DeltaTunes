import React, { useState } from 'react';
import { LoginBG } from '../assets';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== retypePassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const emailCheckResponse = await axios.post('http://localhost:3001/check-email', { email });
            if (!emailCheckResponse.data.isUnique) {
                alert("Email is already in use. Please use a different email.");
                return;
            }

            const signupResponse = await axios.post('http://localhost:3001/signup', { name, email, password });
            console.log(signupResponse);
            navigate('/auth');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                console.log(err);
            }
        }
    };

    return (
        <div style={{
            background: `url(${LoginBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
            className='w-screen h-screen flex items-center justify-center px-4 py-6'
        >
            <div className='container'>
                <p className='text'>SIGN UP FOR</p>
                <p className='text' style={{ color: "lime" }}>DTUNES</p>

                <div className='sub-container'>
                    <div className="p-3 rounded w-25">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name">
                                    <strong className="text" style={{ fontSize: "30px"}}>Username</strong>
                                </label>
                                <input className="desc" style={{ color: "white" ,marginLeft:"140px", width:"50%"}} type="text" placeholder='Enter Name' autoComplete='off' name='name' onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong className="text" style={{ fontSize: "30px" }}>Email Address</strong>
                                </label>
                                <input className="desc" style={{ color: "white", marginLeft:"70px", width:"50%"}} type="text" placeholder='someone@example.com' autoComplete='off' name='email' onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password">
                                    <strong className="text" style={{ fontSize: "30px" }}>New Password</strong>
                                </label>
                                <input className="desc" style={{ color: "white", marginLeft:"55px", width:"50%" }} type="password" placeholder='password' autoComplete='off' name='password' onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="retypePassword">
                                    <strong className="text" style={{ fontSize: "30px" }}>Confirm Password</strong>
                                </label>
                                <input className="desc" style={{ color: "white", marginLeft: "5px", width:"50%" }} type="password" placeholder='confirm password' autoComplete='off' name='retypePassword' onChange={(e) => setRetypePassword(e.target.value)} />
                            </div>

                            <div className='log' style={{ marginTop: "5%" }}>
                                <button type="submit" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <span className='text' style={{ color: "lime", textAlign: "center" }}>Submit</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
