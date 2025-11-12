import { createContext, useContext, useState } from 'react';
import mockData from '../mockData.json';

// Create shopping lists context
const ShoppingListsContext = createContext();

// Custom hook for shopping lists context
export function useShoppingListsContext() {
    return useContext(ShoppingListsContext);
}

// Component that provides shopping lists context
export function ShoppingListsProvider({ children }) {
    // Initialize with shopping lists from mockData
    const initialLists = (mockData.shoppingLists);
    const [shoppingLists, setShoppingLists] = useState(initialLists);

    // Get all shopping lists
    const getAllLists = () => {
        return shoppingLists;
    }

    // Get a shopping list by ID
    const getListById = (listId) => {
        return shoppingLists.find(list => list.id === listId);
    }

    // Get shopping lists where the user is a member or owner
    const getListsByUser = (userId) => {
        return shoppingLists.filter(list =>
            list.ownerId === userId || list.memberIds.includes(userId)
        );
    }

    // Archive a shopping list
    const archiveList = (listId) => {
        setShoppingLists(prevLists =>
            prevLists.map(l =>
                l.id === listId ? { ...l, archived: true } : l
            )
        );
    }

    // Unarchive a shopping list
    const unarchiveList = (listId) => {
        setShoppingLists(prevLists =>
            prevLists.map(l =>
                l.id === listId ? { ...l, archived: false } : l
            )
        );
    }

    // Update a shopping list
    const updateList = (updatedList) => {
        setShoppingLists(prevLists =>
            prevLists.map(list =>
                list.id === updatedList.id ? updatedList : list
            )
        );
    }

    // Add a new shopping list
    const addList = (newList) => {
        // Ensure archived property is set
        const listWithArchived = {
            ...newList,
            archived: newList.archived ?? false
        };
        setShoppingLists(prevLists => [...prevLists, listWithArchived]);
    }

    // Delete a shopping list
    const deleteList = (listId) => {
        setShoppingLists(prevLists =>
            prevLists.filter(list => list.id !== listId)
        );
    }

    const value = {
        shoppingLists,
        getAllLists,
        getListById,
        getListsByUser,
        archiveList,
        unarchiveList,
        updateList,
        addList,
        deleteList
    }

    return (
        <ShoppingListsContext.Provider value={value}>
            {children}
        </ShoppingListsContext.Provider>
    )
}

