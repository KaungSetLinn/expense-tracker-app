import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Link } from 'react-router-dom';
import { auth, handleCreateUserWithEmailAndPassword } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faWallet } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from './LoadingScreen';

const SignupForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const [emailVerificationSent, setEmailVerificationSent] = useState(false);
    const [errors, setErrors] = useState({});

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible((prev) => !prev);
    };

    const validateForm = () => {
        let errorMessages = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!username)
            errorMessages.username = "ユーザー名は必須です。";

        if (!email) {
            errorMessages.email = "メールアドレスは必須です。";
        } else if (!emailRegex.test(email)) {
            errorMessages.email = "メールアドレスの形式が無効です。";
        }

        if (!password) {
            errorMessages.password = "パスワードは必須です。";
        } else if (password.length < 6) {
            errorMessages.password = "パスワードは6文字以上である必要があります。";
        }

        if (!confirmPassword) {
            errorMessages.confirmPassword = "パスワード確認は必須です。";
        } else if (confirmPassword !== password) {
            errorMessages.confirmPassword = "パスワードが一致しません。";
        }

        setErrors(errorMessages);
        return Object.keys(errorMessages).length === 0;
    };

    const checkUserVerification = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                user.reload().then(() => {
                    if (user.emailVerified) {
                        console.log('Email is verified');
                        // Handle what to do if the email is verified
                    } else {
                        console.log('Email is not verified');
                        // Handle what to do if the email is not verified
                    }
                });
            }
        });
    };

    // Manually store the new user into the database
    const storeNewUser = async (user) => {
        const newUser = {
            user_id: user.uid,
            email: email
        };

        try {
            const response = await axios.post('http://localhost:3001/signup', newUser);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error storing into database', error);
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            setLoading(true);

            try {
                createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    
                    // manually store displayName to firebase
                    updateProfile(user, {
                        displayName : username
                    });

                    storeNewUser(user);

                    sendEmailVerification(user)
                    .then(() => {
                        // Email sent
                        setEmailVerificationSent(true);
                        setLoading(false);
                        console.log(user)
                    })
                    .catch((error) => {
                        console.error('Error sending email verification:', error);
                    });
                })
                .catch((error) => {
                    console.error('Error signing up:', error);
                });
                
                

                // Clear form fields if needed
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                //checkUserVerification();
            } catch (error) {
                console.log(error);
            }
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="container">
            {!emailVerificationSent ? (<div className="row mt-5">
                <div className="col-md-6 offset-md-3">
                    <h2 className='fw-bolder'>
                        <FontAwesomeIcon icon={faWallet} style={{ color : 'blue' }} className='mx-3' />
                        家計簿マスターへようこそ
                        <FontAwesomeIcon icon={faWallet} style={{ color : 'blue' }} className='mx-3' />
                    </h2>
                    <div className="card my-4 border-0" style={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
                        <form className="card-body cardbody-color" onSubmit={handleSignup}>
                            <div className="text-center">
                                <img
                                    src="/user-icon.png"
                                    className="img-fluid my-4"
                                    width="300px"
                                    alt="プロフィール画像"
                                />
                            </div>

                            <h4 className="mb-4 fw-bolder">新規登録</h4>

                            <div className="mb-4">
                                <label htmlFor="username" className='float-start mb-2 mx-1 fw-bold'>ユーザー名 <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    value={username}
                                    className="form-control"
                                    id="username"
                                    placeholder="例：電子太郎"
                                    ref={usernameRef}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                {errors.username && <div className="text-danger text-start mt-2">{errors.username}</div>}
                            </div>

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
                                        tabIndex={0} // Make it focusable for accessibility
                                    />
                                </div>
                                {errors.password && <div className="text-danger text-start mt-2">{errors.password}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor='password' className='float-start mb-2 mx-1 fw-bold'>パスワード確認 <span className="text-danger">*</span></label>
                                <div className='input-with-icon'>
                                    
                                    <input
                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                        value={confirmPassword}
                                        className="form-control"
                                        id="confirmPassword"
                                        placeholder="6文字以上"
                                        ref={confirmPasswordRef}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <FontAwesomeIcon 
                                        icon={isConfirmPasswordVisible ? faEyeSlash : faEye} 
                                        className='icon'
                                        onClick={toggleConfirmPasswordVisibility}
                                        role="button"
                                        tabIndex={0} // Make it focusable for accessibility
                                    />
                                </div>
                                {errors.confirmPassword && <div className="text-danger text-start mt-2">{errors.confirmPassword}</div>}
                            </div>

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary mb-3 px-5 w-100">登録</button>
                            </div>

                            <div className="form-text text-center mb-3 text-dark">
                                既にアカウントをお持ちですか？ <Link to={"/"} className='fw-bold'>ログインする</Link> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>) : (
                <div className='loading-container'>
                    <span>確認メールが送信されました。メールをチェックしてください。</span>
                    <Link to={"/"}>ログイン画面へ戻る</Link>
                </div>
            )}
        </div>
    );
}

export default SignupForm;
