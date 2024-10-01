import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { faEye, faEyeSlash, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingScreen from './LoadingScreen';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const validateForm = () => {
        let errorMessages = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email) {
            errorMessages.email = "メールアドレスは必須です。";
        } else if (!emailRegex.test(email)) {
            errorMessages.email = "メールアドレスの形式が無効です。";
        }

        if (!password) {
            errorMessages.password = "パスワードは必須です。";
        }

        setErrors(errorMessages);
        return Object.keys(errorMessages).length === 0;
    };

    const handleLoginFailure = () => {
        setErrors(prevErrors => ({...prevErrors, loginFailMassage : "メールアドレスまたはパスワードが間違っています。"}));
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            setLoading(true);
            
            try {
                signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    const user = userCredential.user;

                    if (!user.emailVerified) {
                        console.log('Email is not verified');
                        // Handle the scenario where the email is not verified
                        // For example, you might redirect them to a page informing them to verify their email
                    } else {
                        // console.log(user);
                        onLogin(user);
                        setLoading(false);
                    }
                })
                // If login fails
                .catch((error) => {
                    handleLoginFailure();

                    setLoading(false);
                });
            } catch (error) {
                console.error('Error logging in:', error);
            }

            setEmail("");
            setPassword("");
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-6 offset-md-3">
                    <h2 className='fw-bolder'>
                        <FontAwesomeIcon icon={faWallet} style={{ color : 'blue' }} className='mx-3' />
                        家計簿マスターへようこそ
                        <FontAwesomeIcon icon={faWallet} style={{ color : 'blue' }} className='mx-3' />
                    </h2>
                    <div className="card my-4 border-0" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
                        <form className="card-body cardbody-color" onSubmit={handleLogin}>
                            <div className="text-center">
                                <img
                                    src="/user-icon.png"
                                    className="img-fluid my-4"
                                    width="300px"
                                    alt="ログインアイコン"
                                />
                            </div>

                            <h4 className="mb-4 fw-bolder">ログイン</h4>

                            {errors.loginFailMassage && (
                                <div className='mb-4 alert alert-danger' role='alert'>
                                    {errors.loginFailMassage}
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="email" className='float-start mb-2 mx-1 fw-bold'>メールアドレス <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    value={email}
                                    className="form-control"
                                    id="email"
                                    placeholder="例：abc@gmail.com"
                                    ref={emailRef}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className="text-danger text-start mt-2">{errors.email}</div>}
                            </div>
                            <div className="mb-4">
                            <label htmlFor='password' className='float-start mb-2 mx-1 fw-bold'>パスワード <span className="text-danger">*</span></label>
                                <div className='input-with-icon'>
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        value={password}
                                        className="form-control"
                                        id="password"
                                        placeholder="6文字以上"
                                        ref={passwordRef}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <FontAwesomeIcon 
                                        icon={isPasswordVisible ? faEyeSlash : faEye} 
                                        className='icon'
                                        onClick={togglePasswordVisibility}
                                        role="button"
                                    />
                                </div>
                                {errors.password && <div className="text-danger text-start mt-2">{errors.password}</div>}
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary mb-3 px-5 w-100">ログイン</button>
                            </div>

                            <div className="form-text text-center mb-3 text-dark">
                                新規登録がまだですか？ <Link to={"/signup"} className="fw-bold">アカウントを作成する</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
