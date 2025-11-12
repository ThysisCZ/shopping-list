import { useState, useEffect } from 'react';
import { Card, Form, Container, Col, Row, Button, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPencil, mdiCheck, mdiCancel } from '@mdi/js';
import LeaveListModal from './LeaveListModal';

function ListHeader({ currentUser, users, shoppingList, setShoppingList, shoppingLists }) {
    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(shoppingList.title);
    const [leaveListShow, setLeaveListShow] = useState(false);
    const [validated, setValidated] = useState(false);

    // Sync edit state when shoppingList title changes (but not when editing)
    useEffect(() => {
        if (!isEditing) {
            setEdit(shoppingList.title);
        }
    }, [shoppingList.title, isEditing]);

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
        e.stopPropagation();
        setValidated(true);

        const form = e.currentTarget;
        if (!form.checkValidity()) {
            return;
        }

        // Check for duplicates before saving
        const isDuplicate = shoppingLists.find(
            (list) => list.id !== shoppingList.id &&
                list.title.toLowerCase() === edit.toLowerCase()
        );

        if (isDuplicate) {
            return; // Don't save if duplicate
        }

        // Update the shopping list with new title
        const updatedList = { ...shoppingList, title: edit };
        setShoppingList(updatedList);

        setIsEditing(false);
        setValidated(false);
    }

    return (
        <>
            <Card className="Shopping-list-container" style={{ backgroundColor: 'salmon' }}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Form noValidate validated={validated} onSubmit={handleEdited}>
                                    <Stack direction="horizontal" gap={3} className="align-items-start">
                                        {isEditing ? (
                                            <Form.Group className="mb-0" style={{ minWidth: '300px', flexShrink: 0 }}>
                                                <Form.Control
                                                    id="listTitle"
                                                    name="listTitle"
                                                    type="text"
                                                    value={edit}
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value;
                                                        setEdit(inputValue);
                                                        const isDuplicate = shoppingLists.find(
                                                            (list) => list.id !== shoppingList.id &&
                                                                list.title.toLowerCase() === inputValue.toLowerCase()
                                                        );
                                                        e.target.setCustomValidity(isDuplicate ? "Duplicate" : "");
                                                    }}
                                                    maxLength={20}
                                                    required
                                                    isInvalid={
                                                        validated && (
                                                            edit.length === 0 ||
                                                            shoppingLists.find(
                                                                (list) => list.id !== shoppingList.id &&
                                                                    list.title.toLowerCase() === edit.toLowerCase()
                                                            )
                                                        )
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {validated && edit.length === 0 && "This field is required."}
                                                    {validated && shoppingLists.find(
                                                        (list) => list.id !== shoppingList.id &&
                                                            list.title.toLowerCase() === edit.toLowerCase()
                                                    ) && "A list with this title already exists."}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        ) : (
                                            <h2 className="mb-0">{edit}</h2>
                                        )}
                                        {currentUser.id === ownerId && (
                                            !isEditing ? (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setIsEditing(true)}
                                                    style={{ marginTop: 5 }}
                                                >
                                                    <Icon path={mdiPencil} size={0.7}></Icon>
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        type="submit"
                                                        style={{ marginTop: 5 }}
                                                    >
                                                        <Icon path={mdiCheck} size={0.7}></Icon>
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setEdit(shoppingList.title); // Reset to original title
                                                            setValidated(false);
                                                        }}
                                                        style={{ marginTop: 5 }}
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