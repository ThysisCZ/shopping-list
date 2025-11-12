import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, ListGroup, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose, mdiDelete, mdiArchive, mdiArchiveOff, mdiEye } from '@mdi/js';
import { useUserContext } from '../context/UserContext';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import AddListModal from '../components/AddListModal';
import DeleteListModal from '../components/DeleteListModal';

function ShoppingLists() {
    const navigate = useNavigate();
    const { currentUser } = useUserContext();
    const {
        getListsByUser,
        getListById,
        getAllLists,
        archiveList,
        unarchiveList,
        deleteList,
        addList,
        updateList
    } = useShoppingListsContext();

    const [showArchived, setShowArchived] = useState(false);
    const [addListShow, setAddListShow] = useState(false);
    const [deleteListShow, setDeleteListShow] = useState(false);
    const [selectedList, setSelectedList] = useState(null);

    // Get lists where user is owner or member
    let userLists = getListsByUser(currentUser.id);

    // Filter by archived status
    const filteredLists = showArchived
        ? userLists
        : userLists.filter(list => !list.archived);

    // Handle item resolved status toggle
    const handleItemResolved = (listId, itemId) => {
        const list = getListById(listId);
        if (!list) return;

        const updatedItems = list.items.map(item =>
            item.id === itemId ? { ...item, resolved: !item.resolved } : item
        );

        updateList({ ...list, items: updatedItems });
    };

    // Handle item deletion
    const handleItemDelete = (listId, itemId) => {
        const list = getListById(listId);
        if (!list) return;

        const updatedItems = list.items.filter(item => item.id !== itemId);
        updateList({ ...list, items: updatedItems });
    };

    // Handle list deletion
    const handleListDelete = (listId) => {
        deleteList(listId);
        setDeleteListShow(false);
        setSelectedList(null);
    };

    // Handle list archiving
    const handleArchive = (listId) => {
        const list = getListById(listId);
        if (list && list.archived) {
            unarchiveList(listId);
        } else {
            archiveList(listId);
        }
    };

    // Handle add list
    const handleListAdd = (newList) => {
        addList(newList);
    };

    // Handle view detail navigation
    const handleViewDetail = (listId) => {
        navigate(`/detail/${listId}`);
    };

    // Check if user is owner
    const isOwner = (list) => {
        return list.ownerId === currentUser.id;
    };

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h1>Shopping Lists</h1>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <Form.Check
                        type="switch"
                        label="Show archived"
                        checked={showArchived}
                        onChange={() => setShowArchived(!showArchived)}
                    />
                </Col>
                <Col xs="auto">
                    <Button variant="success" onClick={() => setAddListShow(true)}>
                        <Icon path={mdiPlus} size={0.7} /> Add List
                    </Button>
                </Col>
            </Row>

            <Row>
                {filteredLists.map(list => (
                    <Col key={list.id} md={6} lg={4} className="mb-4">
                        <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Card.Header style={{ backgroundColor: "salmon" }}>
                                <h5 className="mb-0">{list.title}</h5>
                            </Card.Header>
                            <Card.Body style={{ flex: 1, overflowY: 'auto', backgroundColor: "lightsalmon" }}>
                                <ListGroup variant="flush">
                                    {list.items.length > 0 ? (
                                        list.items.map(item => (
                                            <ListGroup.Item key={item.id} style={{ backgroundColor: "lightsalmon" }}>
                                                <Stack direction="horizontal" gap={2}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={item.resolved}
                                                        onChange={() => handleItemResolved(list.id, item.id)}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{
                                                            textDecoration: item.resolved ? 'line-through' : 'none'
                                                        }}>
                                                            {item.name}
                                                        </span>
                                                        {item.quantity && (
                                                            <span className="text-muted ms-2">
                                                                {item.quantity} {item.unit || ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleItemDelete(list.id, item.id)}
                                                    >
                                                        <Icon path={mdiClose} size={0.7} />
                                                    </Button>
                                                </Stack>
                                            </ListGroup.Item>
                                        ))
                                    ) : (
                                        <ListGroup.Item className="text-muted text-center" style={{ backgroundColor: "lightsalmon" }}>
                                            No items
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card.Body>
                            <Card.Footer style={{ backgroundColor: "salmon" }}>
                                <Stack direction="horizontal" gap={2} className="justify-content-end">
                                    {isOwner(list) && (
                                        <>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedList(list);
                                                    setDeleteListShow(true);
                                                }}
                                            >
                                                <Icon path={mdiDelete} size={0.7} /> Delete
                                            </Button>
                                            <Button
                                                variant={list.archived ? "secondary" : "warning"}
                                                size="sm"
                                                onClick={() => handleArchive(list.id)}
                                            >
                                                {list.archived ? (
                                                    <>
                                                        <Icon path={mdiArchiveOff} size={0.7} />
                                                        <span> Unarchive</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon path={mdiArchive} size={0.7} />
                                                        <span> Archive</span>
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleViewDetail(list.id)}
                                    >
                                        <Icon path={mdiEye} size={0.7} /> Detail
                                    </Button>
                                </Stack>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredLists.length === 0 && (
                <Row>
                    <Col className="text-center text-muted mt-4">
                        <p>No shopping lists found.</p>
                    </Col>
                </Row>
            )}

            <AddListModal
                show={addListShow}
                setAddListShow={setAddListShow}
                onListAdd={handleListAdd}
                shoppingLists={getAllLists()}
                currentUserId={currentUser.id}
            />

            <DeleteListModal
                show={deleteListShow}
                setDeleteListShow={setDeleteListShow}
                onListDelete={handleListDelete}
                list={selectedList}
            />
        </Container>
    )
}

export default ShoppingLists;
