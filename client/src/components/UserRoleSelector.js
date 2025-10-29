import Form from 'react-bootstrap/Form';

function UserRoleSelector({ users, authenticate }) {

    return (
        <Form.Select onChange={(e) => authenticate(e.target.value)}>
            {users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.name}
                </option>
            ))}
        </Form.Select>
    )
}

export default UserRoleSelector;