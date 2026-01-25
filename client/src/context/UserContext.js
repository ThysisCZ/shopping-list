import { createContext, useContext, useState } from 'react';

// Create user context
const UserContext = createContext();

// Custom hook for user context
export function useUserContext() {
    return useContext(UserContext);
}

// Component that provides user context
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [token, setToken] = useState(null);
    const [logoutCall, setLogoutCall] = useState("inactive");

    // Login function - stores user data and token
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
    };

    // Logout function - clears everything
    const logout = () => {
        setLogoutCall("pending");

        setTimeout(() => {
            setUser(null);
            setToken(null);

            setLogoutCall("success");
        }, 2000);
    };

    // Value that will be accessible to all components
    const value = {
        user,
        users,
        setUsers,
        token,
        login,
        logout,
        logoutCall
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}