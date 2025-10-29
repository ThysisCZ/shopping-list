import ListHeader from '../components/ListHeader';
import MemberList from '../components/MemberList';
import ItemList from '../components/ItemList';
import mockData from '../mockData.json';
import { useState } from 'react';

function Detail({ currentUser, users }) {
    const [shoppingList, setShoppingList] = useState(mockData.shoppingList);
    const isAuthorized = shoppingList.memberIds.includes(currentUser.id);

    return (
        <div>
            {isAuthorized ? (
                <>
                    <ListHeader
                        currentUser={currentUser}
                        users={users}
                        shoppingList={shoppingList}
                        setShoppingList={setShoppingList}
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