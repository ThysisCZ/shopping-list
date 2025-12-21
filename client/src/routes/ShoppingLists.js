import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, ListGroup, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose, mdiDelete, mdiArchive, mdiArchiveOff, mdiEye } from '@mdi/js';
import { useUserContext } from '../context/UserContext';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import { useModeContext } from '../context/ModeContext';
import { useLanguageContext } from '../context/LanguageContext';
import AddListModal from '../components/AddListModal';
import DeleteListModal from '../components/DeleteListModal';
import { ClipLoader } from 'react-spinners';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

function ShoppingLists() {
    const navigate = useNavigate();
    const { currentUser } = useUserContext();
    const {
        shoppingLists,
        setShoppingLists,
        getListsByUser,
        getListById,
        archiveList,
        unarchiveList,
        deleteList,
        addList,
        updateList,
        showArchived,
        setShowArchived
    } = useShoppingListsContext();
    const { mode } = useModeContext();
    const { currentLanguage } = useLanguageContext();

    const [addListShow, setAddListShow] = useState(false);
    const [deleteListShow, setDeleteListShow] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [userLists, setUserLists] = useState([]);
    const [userListsCall, setUserListsCall] = useState({ state: "pending" });

    // Get lists where user is owner or member
    const refreshUserLists = useCallback(async () => {
        setUserListsCall({ state: "pending" });

        try {
            const data = await getListsByUser(currentUser.id);

            if (data) {
                setUserLists(data);
                setUserListsCall({ state: "success", data });
            } else {
                setUserListsCall({ state: "error", error: "Failed to load shopping lists." });
            }
        } catch (e) {
            setUserListsCall({ state: "error", error: e.message });
        }
    }, [currentUser.id, getListsByUser]);

    useEffect(() => {
        refreshUserLists();
    }, [refreshUserLists]);

    // Handle item resolved status toggle
    const handleItemResolved = async (listId, itemId) => {
        const list = await getListById(listId);

        // Find the item and toggle resolved
        const updatedItem = list.items.find(item => item.itemId === itemId);
        updatedItem.resolved = !updatedItem.resolved;

        if (USE_MOCKS) {
            // Call mock data
            const updatedItems = list.items.map(item =>
                item.itemId === itemId ? updatedItem : item
            );
            const updatedList = { ...list, items: updatedItems };

            await updateList(updatedList);
        } else {
            // Call the server
            try {
                const dtoIn = {
                    itemId: updatedItem.itemId,
                    resolved: updatedItem.resolved
                }

                const response = await fetch(`${SERVER_URI}listItem/update`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dtoIn)
                });

                // Refresh without loading
                const refreshed = await getListsByUser(currentUser.id);
                setUserLists(refreshed);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error:", e.message);
            }
        }
    };

    // Handle item deletion
    const handleItemDelete = async (listId, itemId) => {
        const list = await getListById(listId);
        const deletedItem = list.items.find(item => item.itemId === itemId);

        if (USE_MOCKS) {
            const updatedItems = list.items.filter(item => item.itemId !== deletedItem.itemId);

            const updatedList = { ...list, items: updatedItems };
            await updateList(updatedList);

            const refreshed = await getListsByUser(currentUser.id);
            setUserLists(refreshed);
        } else {
            const dtoIn = {
                itemId: deletedItem.itemId
            }

            try {
                const response = await fetch(`${SERVER_URI}listItem/delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dtoIn)
                });

                const refreshed = await getListsByUser(currentUser.id);
                setUserLists(refreshed);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: " + e.message);
            }
        }
    };

    // Handle list deletion
    const handleListDelete = async (listId) => {
        setDeleteListShow(false);
        setSelectedList(null);

        if (USE_MOCKS) {
            await deleteList(listId);
            refreshUserLists();
        } else {
            const dtoIn = {
                listId: listId
            }

            try {
                const response = await fetch(`${SERVER_URI}shoppingList/delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dtoIn)
                });

                refreshUserLists();

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: " + e.message);
            }
        }
    };

    // Handle list archiving
    const handleArchive = async (listId) => {
        const list = await getListById(listId);

        if (USE_MOCKS) {
            list.archived ? await unarchiveList(listId) : await archiveList(listId);
            refreshUserLists();
        } else {
            const dtoIn = {
                listId: list.listId,
                title: list.title,
                archived: !list.archived
            }

            try {
                const response = await fetch(`${SERVER_URI}shoppingList/update`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dtoIn)
                });

                refreshUserLists();

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    };

    // Handle add list
    const handleListAdd = async (newList) => {
        if (USE_MOCKS) {
            await addList(newList);
            refreshUserLists();
        } else {
            const dtoIn = {
                title: newList.title,
                ownerId: newList.ownerId
            }

            try {
                const response = await fetch(`${SERVER_URI}shoppingList/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dtoIn)
                });

                refreshUserLists();

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
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
        <div style={{ margin: 30 }}>
            <Container className="mt-3" style={{ color: mode === "light" ? "black" : "white" }}>
                <Row className="mb-4">
                    <Col>
                        <h1>{currentLanguage.id === "EN" ? "Shopping Lists" : "Nákupní seznamy"}</h1>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Check
                            type="switch"
                            label={currentLanguage.id === "EN" ? "Show archived" : "Zobrazit archivované"}
                            checked={showArchived}
                            onChange={() => setShowArchived(!showArchived)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button variant="success" onClick={() => setAddListShow(true)}
                            style={{ display: "flex", alignItems: "center" }}>
                            <Stack direction="horizontal" gap={1}>
                                <Icon path={mdiPlus} size={0.7} /> {currentLanguage.id === "EN" ? "Add list" : "Přidat seznam"}
                            </Stack>
                        </Button>
                    </Col>
                </Row>

                <Row>
                    {userListsCall.state === "pending" ?
                        <div className="d-flex justify-content-center">
                            <ClipLoader color={mode === "light" ? "black" : "white"} />
                        </div> :
                        userLists.map(list => (
                            <Col key={list.listId} md={6} lg={4} className="mb-4">
                                <Card style={{ height: "100%", display: "flex", flexDirection: "column" }} border={mode === "dark" ? "dark" : ""}>
                                    <Card.Header style={{ backgroundColor: "salmon" }}>
                                        <h5 className="mb-0">{list.title}</h5>
                                    </Card.Header>
                                    <Card.Body style={{ flex: 1, overflowY: 'auto', backgroundColor: "lightsalmon" }}>
                                        <ListGroup variant="flush">
                                            {list.items.length > 0 ? (
                                                list.items.map(item => (
                                                    <ListGroup.Item key={item.itemId} style={{ backgroundColor: "lightsalmon" }}>
                                                        <Stack direction="horizontal" gap={2}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                checked={item.resolved}
                                                                onChange={() => handleItemResolved(list.listId, item.itemId)}
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
                                                                onClick={() => handleItemDelete(list.listId, item.itemId)}
                                                                style={{ display: "flex", alignItems: "center", height: 30 }}
                                                            >
                                                                <Icon path={mdiClose} size={0.7} />
                                                            </Button>
                                                        </Stack>
                                                    </ListGroup.Item>
                                                ))
                                            ) : (
                                                <ListGroup.Item className="text-muted text-center" style={{ backgroundColor: "lightsalmon" }}>
                                                    {currentLanguage.id === "EN" ? "No items" : "Žádné položky"}
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
                                                        style={{ display: "flex", alignItems: "center" }}
                                                    >
                                                        <Stack direction="horizontal" gap={1}>
                                                            <Icon path={mdiDelete} size={0.7} /> {currentLanguage.id === "EN" ? "Delete" : "Smazat"}
                                                        </Stack>
                                                    </Button>
                                                    <Button
                                                        variant={list.archived ? "secondary" : "warning"}
                                                        size="sm"
                                                        onClick={() => handleArchive(list.listId)}
                                                        style={{ display: "flex", alignItems: "center" }}
                                                    >
                                                        <Stack direction="horizontal" gap={1}>
                                                            {list.archived ? (
                                                                <>
                                                                    <Icon path={mdiArchiveOff} size={0.7} />
                                                                    <span>{currentLanguage.id === "EN" ? " Unarchive" : " Obnovit"}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Icon path={mdiArchive} size={0.7} />
                                                                    <span>{currentLanguage.id === "EN" ? " Archive" : " Uložit"}</span>
                                                                </>
                                                            )}
                                                        </Stack>
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleViewDetail(list.listId)}
                                                style={{ display: "flex", alignItems: "center" }}
                                            >
                                                <Stack direction="horizontal" gap={1}>
                                                    <Icon path={mdiEye} size={0.7} /> Detail
                                                </Stack>
                                            </Button>
                                        </Stack>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                </Row>

                {userLists.length === 0 && userListsCall.state !== "pending" && (
                    <Row>
                        <Col className="text-center mt-4">
                            <p style={{ color: mode === "dark" ? "light" : "dark" }}>
                                {currentLanguage.id === "EN" ? "No shopping lists found." : "Nejsou tu žádné seznamy."}
                            </p>
                        </Col>
                    </Row>
                )}

                <AddListModal
                    show={addListShow}
                    setAddListShow={setAddListShow}
                    onListAdd={handleListAdd}
                    shoppingLists={shoppingLists}
                    setShoppingLists={setShoppingLists}
                    currentUser={currentUser}
                />

                <DeleteListModal
                    show={deleteListShow}
                    setDeleteListShow={setDeleteListShow}
                    onListDelete={handleListDelete}
                    list={selectedList}
                />
            </Container>
        </div >
    )
}

export default ShoppingLists;
