import { Modal, Form, Col, Row, Button, ListGroup, Container, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import { useState } from 'react';

function InviteMemberModal({ show, setInviteMemberShow, onMembersInvite, users, list }) {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleClose = () => {
        setSelectedUsers([]);
        setInviteMemberShow(false);
    }

    // Select user to be invited as member
    const handleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    }

    // Filter owner and users that are already members
    const availableUsers = users.filter(user => {
        const isOwner = user.id === list.ownerId;
        const isMember = list.memberIds.includes(user.id);
        return !isOwner && !isMember;
    });

    // Update current data after form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        onMembersInvite(selectedUsers);
        setSelectedUsers([]);
        setInviteMemberShow(false);
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Members</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {availableUsers.length === 0 ? (
                        <p className="text-center text-muted">No users to invite.</p>
                    ) : (
                        <ListGroup variant="flush">
                            {availableUsers.map(user => {
                                return (
                                    <ListGroup.Item key={user.id} style={{ backgroundColor: 'lightsalmon' }}>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <Stack direction="horizontal" gap={3}>
                                                        <Icon path={mdiAccount} size={0.8} />
                                                        <b>{user.name}</b>
                                                    </Stack>
                                                </Col>
                                                <Col xs="auto">
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => handleUserSelection(user.id)}
                                                    />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div>
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={selectedUsers.length === 0}
                            >
                                Invite ({selectedUsers.length})
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default InviteMemberModal;