import React, { useEffect, useRef, useState } from 'react';
import { auth } from '../firebase';
import BootstrapModal from './BootstrapModal';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Account = ({ userData, logout }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [editUsername, setEditUsername] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    useEffect(() => {
        const user = auth.currentUser;
        setUsername(user.displayName);
        setEmail(user.email);
    }, []);

    const togglePasswordVisibility = (setter) => () => {
        setter((prev) => !prev);
    };

    const handleEditUsername = () => {
        setEditPassword(false);
        setNewUsername(username);
        setEditUsername(true);
        focusInput(usernameInputRef);

        cancelEditPassword();
    };

    const cancelEditUsername = () => setEditUsername(false);

    const saveNewUsername = async () => {
        const user = auth.currentUser;
        try {
            await updateProfile(user, { displayName: newUsername });
            setUsername(newUsername);
            setSuccessMessage('ユーザー名が正常に更新されました！');
            setShowSuccessModal(true);
            cancelEditUsername();
        } catch (error) {
            console.error('Error updating username: ', error);
        }
    };

    const handleEditPassword = () => {
        setEditUsername(false);
        setEditPassword(true);
        focusInput(passwordInputRef);
    };

    const cancelEditPassword = () => {
        setEditPassword(false);
        setCurrentPassword('');
        setNewPassword('');
    };

    const validatePasswords = () => {
        const errorMessages = {};
        if (!currentPassword) errorMessages.currentPasswordError = "現在のパスワードが必須です。";
        if (currentPassword.length < 6) errorMessages.currentPasswordError = "パスワードは6文字以上である必要があります。";
        if (!newPassword) errorMessages.newPasswordError = "新しいパスワードが必須です。";
        if (newPassword.length < 6) errorMessages.newPasswordError = "パスワードは6文字以上である必要があります.";

        setErrors(errorMessages);
        return Object.keys(errorMessages).length === 0;
    };

    const saveNewPassword = async () => {
        if (validatePasswords()) {
            setErrors({});
            console.log(errors)

            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(email, currentPassword);
    
            try {
                // Reauthenticate the user
                await reauthenticateWithCredential(user, credential);
                // Update the password
                await updatePassword(user, newPassword);
                setSuccessMessage('パスワードが正常に更新されました！');
                setShowSuccessModal(true);
                cancelEditPassword();
            } catch (error) {
                console.error('Error updating password: ', error);
                setErrors({ ...errors, updatePasswordError: 'パスワードの更新に失敗しました。' });
            }
        }
    };

    const handleCloseSuccessModal = () => setShowSuccessModal(false);

    const focusInput = (inputRef) => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <div className="container">
            <div className="d-flex mt-3">
                <div className="card text-bg-light" style={{ width: '25rem', marginRight: '20px' }}>
                    <div className="card-body">
                        <h2 className="card-title mb-3 fw-bold">アカウント情報</h2>
                        <div className="text-center">
                            <img src="/user-icon.png" alt="profile" style={{ borderRadius: '50%', width: '120px', height: '120px', objectFit: 'cover' }} />
                        </div>
                        
                        <div className='row mt-3'>
                            <div className='col-sm-4'>ユーザー名</div>
                            {editUsername ? (
                                <div className='col-sm'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        ref={usernameInputRef}
                                    />
                                </div>
                            ) : (
                                <div className='col-sm-8 text-start'>{username}</div>
                            )}
                        </div>

                        <div className='row mt-3'>
                            <div className='col-sm-4'>メールアドレス</div>
                            <div className='col-sm-8 text-start'>{email}</div>
                        </div>

                        {editPassword && (
                            <>
                                <div className='row mt-3'>
                                    <label className='col-sm-4' htmlFor='currentPassword'>現在のパスワード</label>
                                    <div className='col-sm'>
                                        <div className='input-with-icon'>
                                            <input
                                                type={isCurrentPasswordVisible ? 'text' : 'password'}
                                                className='form-control'
                                                id='currentPassword'
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                ref={passwordInputRef}
                                            />
                                            <FontAwesomeIcon 
                                                icon={isCurrentPasswordVisible ? faEyeSlash : faEye}
                                                className='icon'
                                                onClick={togglePasswordVisibility(setIsCurrentPasswordVisible)}
                                                role="button"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {errors.currentPasswordError && (
                                    <div className="text-danger text-start mt-2">{errors.currentPasswordError}</div>
                                )}

                                <div className='row mt-3'>
                                    <label className='col-sm-4' htmlFor='newPassword'>新しいパスワード</label>
                                    <div className='col-sm'>
                                        <div className='input-with-icon'>
                                            <input
                                                type={isNewPasswordVisible ? 'text' : 'password'}
                                                className='form-control'
                                                id='newPassword'
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <FontAwesomeIcon 
                                                icon={isNewPasswordVisible ? faEyeSlash : faEye}
                                                className='icon'
                                                onClick={togglePasswordVisibility(setIsNewPasswordVisible)}
                                                role="button"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {errors.newPasswordError && (
                                    <div className="text-danger text-start mt-2">{errors.newPasswordError}</div>
                                )}
                            </>
                        )}

                        <div className='row mt-3 text-start mx-1'>
                            <div className='col-sm'>
                                {editUsername || editPassword ? (
                                    <>
                                        <button 
                                            type="button" 
                                            className="btn btn-success"
                                            style={{ marginRight: '10px' }} 
                                            onClick={editUsername ? saveNewUsername : saveNewPassword}
                                        >
                                            保存
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-danger"
                                            style={{ marginRight: '10px' }} 
                                            onClick={editUsername ? cancelEditUsername : cancelEditPassword}
                                        >
                                            キャンセル
                                        </button>
                                    </>
                                ) : null}
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={logout}
                                >
                                    サインアウト
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="list-group" style={{ width: '15rem' }}>
                    <li className="list-group-item fw-bolder bg-light" style={{ fontSize: '25px'}}>機能一覧</li>
                    <li className="list-group-item">
                        <a href='#' onClick={(e) => {
                            e.preventDefault();
                            handleEditUsername();
                        }}>
                            ユーザー名変更
                        </a>
                    </li>
                    <li className="list-group-item">
                        <a href='#' onClick={(e) => {
                            e.preventDefault();
                            handleEditPassword();
                        }}>パスワード名変更</a>
                    </li>
                </ul>

                <BootstrapModal successMessage={successMessage} showModal={showSuccessModal} closeModal={handleCloseSuccessModal} />
            </div>
        </div>
    );
};

export default Account;
