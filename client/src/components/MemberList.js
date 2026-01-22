import { Card, Container, Col, Row, Button, Stack, Accordion, ListGroup, Badge } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiAccount, mdiAccountPlus, mdiClose } from '@mdi/js';
import { useState } from 'react';
import InviteMemberModal from './InviteMemberModal';
import DeleteMemberModal from './DeleteMemberModal';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import { useLanguageContext } from '../context/LanguageContext';
import { useUserContext } from '../context/UserContext';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

function MemberList({ currentUser, users, shoppingList, setShoppingList }) {
    const [inviteMemberShow, setInviteMemberShow] = useState(false);
    const [deleteMemberShow, setDeleteMemberShow] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const { updateList } = useShoppingListsContext();
    const { currentLanguage } = useLanguageContext();
    const { token } = useUserContext();

    const handleMembersInvited = async (newIds) => {
        // Add new IDs to shopping list member IDs
        const updatedList = { ...shoppingList, memberIds: [...shoppingList.memberIds, ...newIds] }

        if (USE_MOCKS) {
            await updateList(updatedList);
        } else {
            const dtoIn = {
                memberIds: [...shoppingList.memberIds, ...newIds]
            }

            try {
                const response = await fetch(`${SERVER_URI}/shoppingList/update/${shoppingList._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(dtoIn)
                });

                setShoppingList(updatedList);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    };

    const handleMemberDeleted = async (member) => {
        const updatedList = { ...shoppingList, memberIds: shoppingList.memberIds.filter(id => id !== member._id) }

        if (USE_MOCKS) {
            await updateList(updatedList);
        } else {
            const dtoIn = {
                memberIds: shoppingList.memberIds.filter(id => id !== member._id)
            }

            try {
                const response = await fetch(`${SERVER_URI}/shoppingList/update/${shoppingList._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(dtoIn)
                });

                setShoppingList(updatedList);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }

    };

    const handleInviteMemberShow = () => {
        setInviteMemberShow(true);
    };

    const handleDeleteMemberShow = (member) => {
        setSelectedMember(member);
        setDeleteMemberShow(true);
    };

    return (
        <>
            <Card className="Shopping-list-container" style={{ backgroundColor: 'salmon' }}>
                <Card.Header style={{ backgroundColor: 'bisque' }}>
                    <Container>
                        <Row>
                            <Col>
                                <h5 className="mb-0">{currentLanguage.id === "EN" ? "Members" : "Členové"}</h5>
                            </Col>
                            <Col xs="auto">
                                {currentUser.id === shoppingList.ownerId && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleInviteMemberShow}
                                        style={{ display: "flex", alignItems: "center" }}
                                    >
                                        <Stack direction="horizontal" gap={1}>
                                            <Icon path={mdiAccountPlus} size={0.7} /> {currentLanguage.id === "EN" ? "Invite" : "Pozvat"}
                                        </Stack>
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Accordion style={{ backgroundColor: 'lightsalmon' }}>
                    <Accordion.Item style={{ backgroundColor: "lightsalmon" }}>
                        <Accordion.Header className="Accordion-header" />
                        <Accordion.Body>
                            <ListGroup variant="flush" >
                                {users.map(user => (
                                    shoppingList.memberIds.includes(user._id) && (
                                        <ListGroup.Item key={user._id} style={{ backgroundColor: 'lightsalmon' }}>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <Stack direction="horizontal" gap={3}>
                                                            <Icon path={mdiAccount} size={0.8} />
                                                            <b>{user.name}</b>
                                                            {user._id === shoppingList.ownerId && (
                                                                <Badge bg="primary">{currentLanguage.id === "EN" ? "Owner" : "Vlastník"}</Badge>
                                                            )}
                                                        </Stack>
                                                    </Col>
                                                    <Col xs="auto">
                                                        {currentUser.id === shoppingList.ownerId && user._id !== shoppingList.ownerId && (
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteMemberShow(user)}
                                                                style={{ display: "flex", alignItems: "center", height: 30 }}
                                                            >
                                                                <Icon path={mdiClose} size={0.7} />
                                                            </Button>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </ListGroup.Item>
                                    )
                                ))}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card >

            <InviteMemberModal
                show={inviteMemberShow}
                setInviteMemberShow={setInviteMemberShow}
                onMembersInvite={handleMembersInvited}
                users={users}
                list={shoppingList}
            />

            <DeleteMemberModal
                show={deleteMemberShow}
                setDeleteMemberShow={setDeleteMemberShow}
                onMemberDelete={handleMemberDeleted}
                user={selectedMember}
            />
        </>
    );
}

export default MemberList;