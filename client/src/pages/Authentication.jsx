import React, { useState } from 'react';
import { LoginBG } from '../assets';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/auth', { email, password })
            .then(result => {
                console.log('Server response:', result.data); // Log server response
                if (result.data.message === "Success") {
                    const { user } = result.data;
                    localStorage.setItem('userId', user._id);
                    navigate('/Home'); // Navigate to '/Home' if success
                } else {
                    if(result.data==="The password is incorrect")
                        alert("The password is incorrect");
                    else if(result.data === "No record registered")
                        alert("No record registered");
                    console.log('Login failed:', result.data); // Log if login fails
                }
            })
            .catch(err => {
                console.error('Error during login:', err); // Log any error during request
            });
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
                <p className='text'>LOGIN TO</p>
                <p className='text' style={{ color: "lime"}}>DTUNES</p>

                <div className='sub-container'>
                    <div className="p-3 rounded w-25">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email">
                                    <strong className="text" style={{ fontSize: "25px"}}>Email</strong>
                                </label>
                                <input style={{marginLeft: "17%",display:"inline-block"}} type="text" placeholder='someone@example.com' autoComplete='off' name='email' onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password">
                                    <strong className="text" style={{ fontSize: "25px"}}>Password</strong>
                                </label>
                                <input style={{marginLeft: "7%", display:"inline-block" }} type="password" placeholder='password' autoComplete='off' name='password' onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <p className='desc'>DTunes is a free music streaming platform where users can explore the musical world and artists can publish their creations</p>
                            <p className='desc' style={{color:"lime"}}>New to the platform? Create a free account <a href="./signup" style={{color:"aqua"}}><u>Here</u></a></p>

                            <div className='log' style={{ marginTop: "5%" }}>
                                <button type="submit" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <span className='text' style={{ color: "white", textAlign: "center", fontSize: "35px" }}>LogIn</span>
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
