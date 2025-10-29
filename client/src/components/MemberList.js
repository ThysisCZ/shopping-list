import { Card, Container, Col, Row, Button, Stack, Accordion, ListGroup, Badge } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiAccount, mdiAccountPlus, mdiClose } from '@mdi/js';
import { useState } from 'react';
import InviteMemberModal from './InviteMemberModal';
import DeleteMemberModal from './DeleteMemberModal';

function MemberList({ currentUser, users, shoppingList, setShoppingList }) {
    const [inviteMemberShow, setInviteMemberShow] = useState(false);
    const [deleteMemberShow, setDeleteMemberShow] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const handleMembersInvited = (newIds) => {
        // Add new IDs to shopping list member IDs
        const updatedList = { ...shoppingList, memberIds: [...shoppingList.memberIds, ...newIds] }

        setShoppingList(updatedList);
    };

    const handleMemberDeleted = (member) => {
        const updatedList = { ...shoppingList, memberIds: shoppingList.memberIds.filter(id => id !== member.id) }

        setShoppingList(updatedList);
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
                <Card.Header style={{ backgroundColor: 'darksalmon' }}>
                    <Container>
                        <Row>
                            <Col>
                                <h5 className="mb-0">Members</h5>
                            </Col>
                            <Col xs="auto">
                                {currentUser.id === shoppingList.ownerId && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleInviteMemberShow}
                                    >
                                        <Icon path={mdiAccountPlus} size={0.7} /> Invite
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Accordion style={{ backgroundColor: 'lightsalmon' }}>
                    <Accordion.Header className="Accordion-header" />
                    <Accordion.Body>
                        <ListGroup variant="flush" >
                            {users.map(user => (
                                shoppingList.memberIds.includes(user.id) && (
                                    <ListGroup.Item key={user.id} style={{ backgroundColor: 'lightsalmon' }}>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <Stack direction="horizontal" gap={3}>
                                                        <Icon path={mdiAccount} size={0.8} />
                                                        <b>{user.name}</b>
                                                        {user.id === shoppingList.ownerId && (
                                                            <Badge bg="primary">Owner</Badge>
                                                        )}
                                                    </Stack>
                                                </Col>
                                                <Col xs="auto">
                                                    {currentUser.id === shoppingList.ownerId && user.id !== shoppingList.ownerId && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteMemberShow(user)}
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
                </Accordion>
            </Card>

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