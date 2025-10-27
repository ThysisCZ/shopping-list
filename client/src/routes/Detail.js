import ListHeader from '../components/ListHeader';
import MemberList from '../components/MemberList';
import ItemList from '../components/ItemList';
import { useUserContext } from '../context/UserContext';
import mockData from '../mockData.json';
import { useState } from 'react';

function Detail() {
    const { currentUser } = useUserContext();
    const [users, setUsers] = useState(mockData.users);
    const isAuthorized = users.some(user =>
        user.id === currentUser.id && user.memberships.includes(mockData.id)
    )

    return (
        <div>
            {isAuthorized ? (
                <>
                    <ListHeader
                        users={users}
                        setUsers={setUsers}
                    />
                    <MemberList
                        users={users}
                        setUsers={setUsers}
                    />
                    <ItemList />
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