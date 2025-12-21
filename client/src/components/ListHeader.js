import { useState, useEffect } from 'react';
import { Card, Form, Container, Col, Row, Button, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPencil, mdiCheck, mdiCancel } from '@mdi/js';
import LeaveListModal from './LeaveListModal';
import { useNavigate } from 'react-router-dom';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import { useLanguageContext } from '../context/LanguageContext';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

function ListHeader({ currentUser, users, shoppingList, setShoppingList, shoppingLists }) {
    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(shoppingList.title);
    const [leaveListShow, setLeaveListShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const { updateList } = useShoppingListsContext();
    const { currentLanguage } = useLanguageContext();

    // Sync edit state when shopping list title changes
    useEffect(() => {
        if (!isEditing) {
            setEdit(shoppingList.title);
        }
    }, [shoppingList.title, isEditing]);

    const ownerId = shoppingList.ownerId;

    const handleListLeft = async () => {
        navigate("/list");

        if (USE_MOCKS) {
            const updatedList = { ...shoppingList, memberIds: shoppingList.memberIds.filter(id => id !== currentUser.id) }
            await updateList(updatedList);
        } else {
            const dtoIn = {
                listId: shoppingList.listId,
                userId: currentUser.id
            }

            try {
                const response = await fetch(`${SERVER_URI}membership/delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dtoIn)
                });

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    }

    const handleLeaveListShow = () => {
        setLeaveListShow(true);
    }

    const listOwner = users.find(user => user.id === ownerId);

    // Change list title based on input field value
    async function handleEdited(e) {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        const form = e.currentTarget;
        if (!form.checkValidity()) {
            return;
        }

        // Update the shopping list with new title
        const updatedList = { ...shoppingList, title: edit };

        if (USE_MOCKS) {
            await updateList(updatedList);

            setIsEditing(false);
            setValidated(false);
        } else {
            const dtoIn = {
                listId: updatedList.listId,
                title: updatedList.title,
                archived: updatedList.archived
            }

            try {
                const response = await fetch(`${SERVER_URI}shoppingList/update`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dtoIn)
                });

                setIsEditing(false);
                setValidated(false);
                setShoppingList(updatedList);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
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
                                                        const isDuplicate = shoppingLists.some(
                                                            (list) => list.listId !== shoppingList.listId &&
                                                                list.title.toLowerCase() === inputValue.toLowerCase()
                                                        );
                                                        e.target.setCustomValidity(isDuplicate ? "Duplicate" : "");
                                                    }}
                                                    maxLength={20}
                                                    required
                                                    isInvalid={
                                                        validated && (
                                                            edit.length === 0 ||
                                                            shoppingLists.some(
                                                                (list) => list.listId !== shoppingList.listId &&
                                                                    list.title.toLowerCase() === edit.toLowerCase()
                                                            )
                                                        )
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {validated && edit.length === 0 && (currentLanguage.id === "EN" ? "This field is required." : "Toto pole je povinné.")}
                                                    {validated && shoppingLists.some(
                                                        (list) => list.listId !== shoppingList.listId &&
                                                            list.title.toLowerCase() === edit.toLowerCase()
                                                    ) && (currentLanguage.id === "EN" ? "This list already exists." : "Tento seznam již existuje.")}
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
                                                    style={{ marginTop: 5, display: "flex", alignItems: "center", height: 30 }}
                                                >
                                                    <Icon path={mdiPencil} size={0.7}></Icon>
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        type="submit"
                                                        style={{ marginTop: 5, display: "flex", alignItems: "center", height: 30 }}
                                                    >
                                                        <Icon path={mdiCheck} size={0.7}></Icon>
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setEdit(shoppingList.title);
                                                            setValidated(false);
                                                        }}
                                                        style={{ marginTop: 5, display: "flex", alignItems: "center", height: 30 }}
                                                    >
                                                        <Icon path={mdiCancel} size={0.7}></Icon>
                                                    </Button>
                                                </>
                                            )
                                        )}
                                    </Stack>
                                </Form>
                                <small className="text-muted">{currentLanguage.id === "EN" ? "Owner" : "Vlastník"}: {listOwner.name}</small>
                            </Col>
                            {currentUser.id !== ownerId && (
                                <Col xs="auto">
                                    <Button
                                        variant="danger"
                                        onClick={handleLeaveListShow}
                                    >
                                        {currentLanguage.id === "EN" ? "Leave" : "Opustit"}
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