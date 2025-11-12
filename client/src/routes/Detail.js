import { useParams } from 'react-router-dom';
import ListHeader from '../components/ListHeader';
import MemberList from '../components/MemberList';
import ItemList from '../components/ItemList';
import { useShoppingListsContext } from '../context/ShoppingListsContext';

function Detail({ currentUser, users, shoppingLists }) {
    const { id } = useParams();
    const { getListById, updateList } = useShoppingListsContext();
    const shoppingList = getListById(id);
    const isAuthorized = shoppingList && shoppingList.memberIds.includes(currentUser.id);

    if (!shoppingList) {
        return (
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>404 - Not Found</h1>
                <h3 style={{ textAlign: 'center' }}>Shopping list not found.</h3>
            </div>
        );
    }

    const setShoppingList = (updatedList) => {
        updateList(updatedList);
    };

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
                <>
                    <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>401 - Unauthorized</h1>
                    <h3 style={{ textAlign: 'center' }}>You don't have permission to view this list.</h3>
                </>
            )}
        </div>
    )
}

export default Detail;