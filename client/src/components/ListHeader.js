import { useState } from 'react';
import { Card, Form, Container, Col, Row, Button, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPencil, mdiCheck, mdiCancel } from '@mdi/js';
import LeaveListModal from './LeaveListModal';

function ListHeader({ currentUser, users, shoppingList, setShoppingList }) {
    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(shoppingList.title);
    const [leaveListShow, setLeaveListShow] = useState(false);

    const ownerId = shoppingList.ownerId

    const handleListLeft = () => {
        const updatedList = { ...shoppingList, memberIds: shoppingList.memberIds.filter(id => id !== currentUser.id) }

        setShoppingList(updatedList);
    }

    const handleLeaveListShow = () => {
        setLeaveListShow(true);
    }

    const listOwner = users.find(user => user.id === ownerId);

    // Change list title based on input field value
    function handleEdited(e) {
        e.preventDefault();
        setEdit(e.target["listTitle"].value);
        setIsEditing(false);
    }

    return (
        <>
            <Card className="Shopping-list-container" style={{ backgroundColor: 'salmon' }}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Form onSubmit={handleEdited}>
                                    <Stack direction="horizontal" gap={3}>
                                        {isEditing ? (
                                            <Form.Control
                                                id="listTitle"
                                                type="text"
                                                defaultValue={edit}
                                                maxLength={20}
                                                required
                                                className="w-25"
                                            />
                                        ) : (
                                            <h2 className="mb-0">{edit}</h2>
                                        )}
                                        {currentUser.id === ownerId && (
                                            !isEditing ? (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    <Icon path={mdiPencil} size={0.7}></Icon>
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        type="submit"
                                                    >
                                                        <Icon path={mdiCheck} size={0.7}></Icon>
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => setIsEditing(false)}
                                                    >
                                                        <Icon path={mdiCancel} size={0.7}></Icon>
                                                    </Button>
                                                </>
                                            )
                                        )}
                                    </Stack>
                                </Form>
                                <small className="text-muted">Owner: {listOwner.name}</small>
                            </Col>
                            {currentUser.id !== ownerId && (
                                <Col xs="auto">
                                    <Button
                                        variant="danger"
                                        onClick={handleLeaveListShow}
                                    >
                                        Leave
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Container>
                </Card.Body>
            </Card >

            <LeaveListModal
                show={leaveListShow}
                setLeaveListShow={setLeaveListShow}
                onListLeave={handleListLeft}
                list={shoppingList}
            />
        </>
    )
}

export default ListHeader;