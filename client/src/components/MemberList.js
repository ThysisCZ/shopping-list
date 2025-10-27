import { Card, Container, Col, Row, Button, Stack, Accordion, ListGroup, Badge } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiAccount, mdiAccountPlus, mdiClose } from '@mdi/js';
import { useUserContext } from '../context/UserContext';
import mockData from '../mockData.json';
import { useState } from 'react';
import InviteMemberModal from './InviteMemberModal';
import DeleteMemberModal from './DeleteMemberModal';

function MemberList({ users, setUsers }) {
    const { currentUser } = useUserContext();
    const [inviteMemberShow, setInviteMemberShow] = useState(false);
    const [deleteMemberShow, setDeleteMemberShow] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const handleMembersInvited = (userIds) => {
        // Add new list ID to user's memberships
        const updatedUsers = users.map(user =>
            userIds.includes(user.id) ?
                { ...user, memberships: [...user.memberships, mockData.id] } : user
        );

        setUsers(updatedUsers);
    };

    const handleMemberDeleted = (member) => {
        const updatedUsers = users.map(user =>
            user.id === member.id ?
                { ...user, memberships: user.memberships.filter(id => id !== mockData.id) } : user
        );

        setUsers(updatedUsers);
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
                                {currentUser.ownedLists.some(id => id === mockData.id) && (
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
                                user.memberships.some(id => id === mockData.id) && (
                                    <ListGroup.Item key={user.id} style={{ backgroundColor: 'lightsalmon' }}>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <Stack direction="horizontal" gap={3}>
                                                        <Icon path={mdiAccount} size={0.8} />
                                                        <b>{user.name}</b>
                                                        {user.ownedLists.some(id => id === mockData.id) && (
                                                            <Badge bg="primary">Owner</Badge>
                                                        )}
                                                    </Stack>
                                                </Col>
                                                <Col xs="auto">
                                                    {currentUser.ownedLists.some(id => id === mockData.id) && !user.ownedLists.some(id => id === mockData.id) && (
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