import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm'; 
import Dashboard from './components/Dashboard';
import Transaction from './components/Transaction';
import Expense from './components/Expense';
import Account from './components/Account';
import Report from './components/Report';
import SignupForm from './components/SignupForm';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import LoadingScreen from './components/LoadingScreen';
import { UserProvider, useUser } from './components/UserContext';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { setUserId } = useUser();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("useEffect executed");
            if (user) {
                if (user.emailVerified) {
                    setUser(user);
                    setUserId(user.uid);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleLogin = (user) => {
        setUser(user);
        setUserId(user.uid);
    };

    return (
        <div className='App'>
            {user ? (
                <>
                    <Navbar user={user} />
                    <Routes>
                        <Route path="/" element={<Dashboard />} /> 
                        <Route path="/transaction" element={<Transaction />} /> 
                        <Route path="/expense/:expenseId?" element={<Expense />} /> 
                        <Route path="/report" element={<Report />} /> 
                        <Route path="/account" element={<Account logout={handleLogout} />} />
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignupForm />} /> 
                </Routes>
            )}
        </div>
    );
}

export default App;
