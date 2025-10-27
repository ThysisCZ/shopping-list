import { createContext, useContext, useState } from 'react';
import mockData from '../mockData';

// Create user context
const UserContext = createContext();

// Custom hook for user context
export function useUserContext() {
    return useContext(UserContext);
}

// Component that provides user context
export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState({
        id: 1,
        name: "Alice",
        ownedLists: [
            1,
            2
        ],
        memberships: [
            1,
            2,
            3
        ]
    });

    // Find user based on ID
    const authenticate = (userId) => {
        const userData = mockData.users.find(user => user.id === parseInt(userId))

        if (userData) {
            setCurrentUser(userData)
        }
    }

    const value = {
        currentUser,
        setCurrentUser,
        authenticate
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}