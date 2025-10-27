import mockData from '../mockData';
import Form from 'react-bootstrap/Form';
import { useUserContext } from '../context/UserContext';

function UserRoleSelector() {
    const { authenticate } = useUserContext();

    return (
        <Form.Select onChange={(e) => authenticate(e.target.value)}>
            {mockData.users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.name}
                </option>
            ))}
        </Form.Select>
    )
}

export default UserRoleSelector;