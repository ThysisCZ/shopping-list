import { Modal, Form, Col, Row, Button, ListGroup, Container, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiAccount, mdiAccountSearch } from '@mdi/js';
import { useState } from 'react';
import { useLanguageContext } from '../context/LanguageContext';

function InviteMemberModal({ show, setInviteMemberShow, onMembersInvite, users, list }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searched, setSearched] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const { currentLanguage } = useLanguageContext();

    console.log(searchedUsers)

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

    const handleSearch = () => {
        const filteredUsers = availableUsers.filter(user =>
            user.name.trim().toLowerCase().includes(search.trim().toLowerCase())
        );

        setSearchedUsers(filteredUsers);
        setSearched(true);

        if (!search) {
            setSearched(false);
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentLanguage.id === "EN" ? "Invite Members" : "Pozvat členy"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", flexDirection: "row", gap: 5, marginBottom: 15 }}>
                        <input
                            type="text"
                            placeholder={currentLanguage.id === "EN" ? "Search members..." : "Hledat členy..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="primary" onClick={() => handleSearch()}>
                            <Stack direction="horizontal">
                                <Icon path={mdiAccountSearch} size={0.8}></Icon>
                            </Stack>
                        </Button>

                    </div>
                    {availableUsers.length === 0 ? (
                        <p className="text-center text-muted">{currentLanguage.id === "EN" ? "No users to invite." : "Žádní uživatelé k pozvání."}</p>
                    ) : (
                        <ListGroup variant="flush">
                            {
                                searched && searchedUsers.map(user => {
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
                                {currentLanguage.id === "EN" ? "Cancel" : "Zrušit"}
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={selectedUsers.length === 0}
                            >
                                {currentLanguage.id === "EN" ? "Invite" : "Pozvat"} ({selectedUsers.length})
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default InviteMemberModal;