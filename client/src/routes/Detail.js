import { useParams } from 'react-router-dom';
import ListHeader from '../components/ListHeader';
import MemberList from '../components/MemberList';
import ItemList from '../components/ItemList';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import { useState, useEffect } from 'react';

function Detail({ currentUser, users, shoppingLists }) {
    const { id } = useParams();
    const { getListById } = useShoppingListsContext();
    const [shoppingList, setShoppingList] = useState(null);
    const [shoppingListCall, setShoppingListCall] = useState(null);

    useEffect(() => {
        const load = async () => {
            setShoppingListCall({ state: "pending" });

            try {
                const data = await getListById(id);

                if (data) {
                    setShoppingList(data);
                    setShoppingListCall({ state: "success", data });
                } else {
                    setShoppingListCall({ state: "error", error: "Failed to load shopping list." });
                }
            } catch (e) {
                setShoppingListCall({ state: "error", error: e.message });
            }
        }

        load();
    }, [id, getListById]);

    if (shoppingListCall?.state === "error") {
        return (
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>404 - Not Found</h1>
                <h3 style={{ textAlign: 'center' }}>Shopping list not found.</h3>
            </div>
        );
    }

    const isAuthorized = shoppingList && shoppingList.memberIds.includes(currentUser.id);

    return (
        <div>
            {isAuthorized ? (
                <>
                    <ListHeader
                        currentUser={currentUser}
                        users={users}
                        shoppingList={shoppingList}
                        setShoppingList={setShoppingList}
                        shoppingLists={shoppingLists}

                    />
                    <MemberList
                        currentUser={currentUser}
                        users={users}
                        shoppingList={shoppingList}
                        setShoppingList={setShoppingList}
                    />
                    <ItemList
                        shoppingList={shoppingList}
                        setShoppingList={setShoppingList}
                    />
                </>
            ) : (
                shoppingListCall?.state === "error" && <>
                    <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>401 - Unauthorized</h1>
                    <h3 style={{ textAlign: 'center' }}>You don't have permission to view this list.</h3>
                </>
            )}
        </div>
    )
}

export default Detail;