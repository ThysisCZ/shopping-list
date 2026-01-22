import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, ListGroup, Stack, Accordion } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose, mdiDelete, mdiArchive, mdiArchiveOff, mdiEye } from '@mdi/js';
import { useUserContext } from '../context/UserContext';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import { useModeContext } from '../context/ModeContext';
import { useLanguageContext } from '../context/LanguageContext';
import AddListModal from '../components/AddListModal';
import DeleteListModal from '../components/DeleteListModal';
import DeleteItemModal from '../components/DeleteItemModal';
import { ClipLoader } from 'react-spinners';
import ShoppingListChart from '../components/ShoppingListChart';
import AddItemModal from '../components/AddItemModal';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

function ShoppingLists() {
    const navigate = useNavigate();
    const { user, token, setUsers } = useUserContext();
    const {
        setShoppingLists,
        getAllLists,
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
    const [selectedItem, setSelectedItem] = useState(null);
    const [allLists, setAllLists] = useState([]);
    const [allListsCall, setAllListsCall] = useState({ state: "pending" });
    const [userLists, setUserLists] = useState([]);
    const [userListsCall, setUserListsCall] = useState({ state: "pending" });
    const [addItemShow, setAddItemShow] = useState(false);
    const [deleteItemShow, setDeleteItemShow] = useState(false);

    const items = selectedList?.items;

    // Get shopping lists
    const refreshLists = async () => {
        setAllListsCall({ state: "pending" });
        setUserListsCall({ state: "pending" });

        try {
            const allData = await getAllLists();
            const userData = await getListsByUser(user.id);

            if (allData) {
                setAllLists(allData);
                setAllListsCall({ state: "success", allData });
            } else {
                setAllListsCall({ state: "error", error: "Failed to load shopping lists." });
            }

            if (userData) {
                setUserLists(userData);
                setUserListsCall({ state: "success", userData });
            } else {
                setUserListsCall({ state: "error", error: "Failed to load shopping lists." });
            }
        } catch (e) {
            setUserListsCall({ state: "error", error: e.message });
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await fetch(`${SERVER_URI}/user/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const result = await response.json();
            const dtoOut = result.data;

            console.log("All users", dtoOut)

            setUsers(dtoOut);
        } catch (e) {
            console.error("Error: " + e.message)
        }
    }

    useEffect(() => {
        refreshLists();
        // eslint-disable-next-line
    }, [showArchived, user]);

    useEffect(() => {
        getAllUsers()
        // eslint-disable-next-line
    }, []);

    const handleAddItemShow = () => {
        setAddItemShow(true);
    };

    const handleItemAdded = async (item) => {
        if (USE_MOCKS) {
            await updateList({
                ...selectedList,
                items: [...selectedList.items, item]
            });

            await refreshLists();
        } else {
            const dtoIn = {
                items: [...selectedList.items, item]
            }

            try {
                const response = await fetch(`${SERVER_URI}/shoppingList/update/${selectedList._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(dtoIn)
                });

                setSelectedList({
                    ...selectedList,
                    items: [...selectedList.items, item]
                });

                await refreshLists();

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    }

    // Handle item resolved status toggle
    const handleItemResolved = async (listId, itemId) => {
        const list = await getListById(listId);

        // Find the item and update resolved state
        let updatedItem = list.items.find(item => item._id === itemId);
        updatedItem = { ...updatedItem, resolved: !updatedItem.resolved }

        const updatedItems = list.items.map(item =>
            item._id === itemId ? updatedItem : item
        );

        if (USE_MOCKS) {
            // Call mock data
            const updatedList = { ...list, items: updatedItems };
            await updateList(updatedList);
        } else {
            // Call the server
            try {
                const dtoIn = {
                    items: updatedItems
                }

                const response = await fetch(`${SERVER_URI}/shoppingList/update/${listId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(dtoIn)
                });

                // Refresh without loading
                const refreshed = await getListsByUser(user.id);
                setUserLists(refreshed);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error:", e.message);
            }
        }
    };

    const handleDeleteItemShow = (item) => {
        setSelectedItem(item)
        setDeleteItemShow(true);
    };

    // Handle item deletion
    const handleItemDelete = async (item) => {
        const updatedItems = items?.filter(i => i._id !== item._id);

        if (USE_MOCKS) {
            await updateList({ ...selectedList, items: updatedItems });
        } else {
            const dtoIn = {
                items: updatedItems
            }

            try {
                const response = await fetch(`${SERVER_URI}/shoppingList/update/${selectedList._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(dtoIn)
                });

                const refreshed = await getListsByUser(user.id);
                setUserLists(refreshed);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    };

    // Handle list deletion
    const handleListDelete = async (listId) => {
        setDeleteListShow(false);
        setSelectedList(null);

        if (USE_MOCKS) {
            await deleteList(listId);
            await refreshLists();
        } else {
            try {
                const response = await fetch(`${SERVER_URI}/shoppingList/delete/${listId}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                await refreshLists();

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
            await refreshLists();
        } else {
            const dtoIn = {
                archived: !list.archived
            }

            try {
                const response = await fetch(`${SERVER_URI}/shoppingList/update/${listId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dtoIn)
                });

                await refreshLists();

                const result = await response.json();
                const dtoOut = result.data;

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
            await refreshLists();
        } else {
            try {
                const response = await fetch(`${SERVER_URI}/shoppingList/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newList)
                });

                await refreshLists();

                const result = await response.json();
                const dtoOut = result.data;

                console.log("New list:", dtoOut);

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
        return list.ownerId === user.id;
    };

    return (
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
                {allListsCall.state === "pending" || userListsCall.state === "pending" ?
                    <div className="d-flex justify-content-center">
                        <ClipLoader color={mode === "light" ? "black" : "white"} />
                    </div> :
                    <Accordion>
                        <Accordion.Item style={{ backgroundColor: "beige" }}>
                            <Accordion.Header className="Accordion-header">
                                <div style={{ fontWeight: "bold" }}>
                                    {currentLanguage.id === "EN" ? "Lists" : "Seznamy"}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Row>
                                    {userLists?.map(list => (
                                        <Col key={list._id} md={6} lg={4} className="mb-4">
                                            <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                                <Card.Header style={{ backgroundColor: "salmon" }}>
                                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                        <h5 className="mb-0">{list.title}</h5>
                                                        <Button variant="success" size="sm" onClick={() => {
                                                            setSelectedList(list);
                                                            handleAddItemShow();
                                                        }}
                                                            style={{ display: "flex", alignItems: "center" }}>
                                                            <Stack direction="horizontal" gap={1}>
                                                                <Icon path={mdiPlus} size={0.7} /> {currentLanguage.id === "EN" ? "Add Item" : "Přidat položku"}
                                                            </Stack>
                                                        </Button>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body style={{ flex: 1, overflowY: 'auto', backgroundColor: "lightsalmon" }}>
                                                    <ListGroup variant="flush">
                                                        {list.items.length > 0 ? (
                                                            list.items.map(item => (
                                                                <ListGroup.Item key={item._id} style={{ backgroundColor: "lightsalmon" }}>
                                                                    <Stack direction="horizontal" gap={2}>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            checked={item.resolved}
                                                                            onChange={() => handleItemResolved(list._id, item._id)}
                                                                        />
                                                                        <div style={{ flex: 1 }}>
                                                                            <span style={{
                                                                                textDecoration: item.resolved ? 'line-through' : 'none'
                                                                            }}>
                                                                                {item.name}
                                                                            </span>
                                                                            {item.quantity && (
                                                                                <span className="text-muted ms-2">
                                                                                    {item.quantity} {currentLanguage.id === "CZ" &&
                                                                                        ((item.unit === "tsp" && "ČL") ||
                                                                                            (item.unit === "tbsp" && "PL") ||
                                                                                            (item.unit === "pc" && "ks") ||
                                                                                            (item.unit === "c" && "hrn.") || item.unit)
                                                                                    }
                                                                                    {currentLanguage.id === "EN" && item.unit}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setSelectedList(list);
                                                                                handleDeleteItemShow(item)
                                                                            }}
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
                                                                    onClick={() => handleArchive(list._id)}
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
                                                            onClick={() => handleViewDetail(list._id)}
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
                                    {userLists?.length === 0 && userListsCall.state !== "pending" && (
                                        <Row>
                                            <Col className="text-center mt-4">
                                                <p style={{ color: mode === "dark" ? "light" : "dark", marginBottom: 25 }}>
                                                    {currentLanguage.id === "EN" ? "No shopping lists found." : "Nejsou tu žádné seznamy."}
                                                </p>
                                            </Col>
                                        </Row>
                                    )}
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion>
                            <Accordion.Item style={{ backgroundColor: "beige" }}>
                                <Accordion.Header className="Accordion-header">
                                    <div style={{ fontWeight: "bold" }}>
                                        {currentLanguage.id === "EN" ? "Statistics" : "Statistiky"}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ShoppingListChart userLists={userLists} />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Accordion>}
            </Row>

            <AddListModal
                show={addListShow}
                setAddListShow={setAddListShow}
                onListAdd={handleListAdd}
                shoppingLists={allLists}
                setShoppingLists={setShoppingLists}
                user={user}
            />

            <DeleteListModal
                show={deleteListShow}
                setDeleteListShow={setDeleteListShow}
                onListDelete={handleListDelete}
                list={selectedList}
            />

            <AddItemModal
                show={addItemShow}
                setAddItemShow={setAddItemShow}
                onItemAdd={handleItemAdded}
                items={items}
            />

            <DeleteItemModal
                show={deleteItemShow}
                setDeleteItemShow={setDeleteItemShow}
                onItemDelete={handleItemDelete}
                item={selectedItem}
                list={selectedList}
            />
        </Container>
    )
}

export default ShoppingLists;
