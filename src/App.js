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
    const [userData, setUserData] = useState({}); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { setUserId } = useUser();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("unsubscribe function is called");
            if (user) {
                if (user.emailVerified) {
                    
                    setUser(user);
                    console.log(user);

                    setUserId(user.uid);

                    // setUserData({user_id : user.uid});

                    // Fetch user data from your database
                    // Example: const userData = await fetchUserData(user.uid);
                    // setUserData(userData);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    const handleLogin = (user) => {
        setUser(user);
    };

    const handleLogout = async () => {
        setUser(null);
        await signOut(auth);
        console.log('User logged out successfully');
        navigate('/');
    };

    return (
            <div className='App'>
                {user ? (
                    <>
                        <Navbar user={user} /> {/* Pass user data to Navbar */}
                        <Routes>
                            <Route path="/" element={<Dashboard />} /> 
                            <Route path="/transaction" element={<Transaction />} /> 
                            <Route path="/expense/:expenseId?" element={<Expense />} /> 
                            <Route path='/report' element={<Report />} /> 
                            <Route path="/account" element={<Account userData={userData} logout={handleLogout} />} />
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
