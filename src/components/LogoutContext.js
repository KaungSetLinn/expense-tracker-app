// LogoutContext.js
import React, { createContext, useContext } from 'react';

const LogoutContext = createContext();

export const LogoutProvider = ({ children }) => {
    const logout = () => {
        // Implement your logout logic here
        console.log('Logged out');
    };

    return (
        <LogoutContext.Provider value={logout}>
            {children}
        </LogoutContext.Provider>
    );
};

export const useLogout = () => useContext(LogoutContext);
