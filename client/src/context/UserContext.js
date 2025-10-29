import { createContext, useContext, useState } from 'react';
import mockData from '../mockData.json';

// Create user context
const UserContext = createContext();

// Custom hook for user context
export function useUserContext() {
    return useContext(UserContext);
}

// Component that provides user context
export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState({
        "id": "user_1",
        "name": "Alice"
    });

    const users = mockData.users;

    // Find user based on ID
    const authenticate = (userId) => {
        const userData = users.find(user => user.id === userId);

        if (userData) {
            setCurrentUser(userData)
        }
    }

    const value = {
        currentUser,
        users,
        authenticate
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}