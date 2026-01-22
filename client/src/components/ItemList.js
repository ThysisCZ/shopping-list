import { useState } from 'react';
import { Card, Form, Container, Col, Row, Button, Stack, Accordion, ListGroup } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';
import AddItemModal from './AddItemModal';
import DeleteItemModal from './DeleteItemModal';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import { useLanguageContext } from '../context/LanguageContext';
import { useUserContext } from '../context/UserContext';

const SERVER_URI = process.env.REACT_APP_SERVER_URI;
const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === "true";

function ItemList({ shoppingList, setShoppingList }) {
    const [showResolved, setShowResolved] = useState(false);
    const [addItemShow, setAddItemShow] = useState(false);
    const [deleteItemShow, setDeleteItemShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const { updateList, getListById } = useShoppingListsContext();
    const { currentLanguage } = useLanguageContext();
    const { token } = useUserContext();

    const items = shoppingList.items;

    // Filter items based on toggle state
    const filteredItems = showResolved ? items :
        items.filter(item => !item.resolved)

    // Update resolved status of an item
    const handleResolvedStatus = async (itemId) => {
        const updatedItems = items.map(item =>
            item._id === itemId ? { ...item, resolved: !item.resolved } : item
        );

        if (USE_MOCKS) {
            await updateList({ ...shoppingList, items: updatedItems });
        } else {
            const dtoIn = {
                items: updatedItems
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

                setShoppingList({ ...shoppingList, items: updatedItems });

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    }

    const handleItemAdded = async (item) => {
        if (USE_MOCKS) {
            await updateList({
                ...shoppingList,
                items: [...shoppingList.items, item]
            });

            const refreshed = await getListById(shoppingList.listId);
            setShoppingList(refreshed);
        } else {
            const dtoIn = {
                items: [...shoppingList.items, item]
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

                setShoppingList({
                    ...shoppingList,
                    items: [...shoppingList.items, item]
                });

                const refreshed = await getListById(shoppingList._id);
                setShoppingList(refreshed);

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    }

    const handleItemDeleted = async (item) => {
        const updatedItems = items.filter(i => i._id !== item._id);

        if (USE_MOCKS) {
            await updateList({ ...shoppingList, items: updatedItems });
        } else {
            const dtoIn = {
                items: updatedItems
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

                setShoppingList({ ...shoppingList, items: updatedItems });

                const dtoOut = await response.json();
                return dtoOut;
            } catch (e) {
                console.error("Error: ", e.message);
            }
        }
    }

    const handleAddItemShow = () => {
        setAddItemShow(true);
    };

    const handleDeleteItemShow = (item) => {
        setSelectedItem(item)
        setDeleteItemShow(true);
    };

    return (
        <>
            <Card className="Shopping-list-container" style={{ backgroundColor: 'salmon' }}>
                <Card.Header style={{ backgroundColor: 'bisque' }}>
                    <Container>
                        <Row style={{ marginBottom: 10 }}>
                            <Col>
                                <div>
                                    <div>
                                        <Form.Check
                                            type="switch"
                                            checked={showResolved}
                                            onChange={() => setShowResolved(!showResolved)}
                                        />
                                    </div>
                                    <small className="text-muted">
                                        {currentLanguage.id === "EN" ? "Show resolved" : "Zobrazit vyřešené"}
                                    </small>
                                </div>
                            </Col>
                            <Col xs="auto">
                                <Button variant="success" size="sm" onClick={handleAddItemShow}
                                    style={{ display: "flex", alignItems: "center" }}>
                                    <Stack direction="horizontal" gap={1}>
                                        <Icon path={mdiPlus} size={0.7} /> {currentLanguage.id === "EN" ? "Add" : "Přidat"}
                                    </Stack>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5 className="mb-0">{currentLanguage.id === "EN" ? "Items" : "Položky"}</h5>
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Accordion style={{ backgroundColor: 'lightsalmon' }}>
                    <Accordion.Item style={{ backgroundColor: "lightsalmon" }}>
                        <Accordion.Header className="Accordion-header" />
                        <Accordion.Body>
                            <ListGroup variant="flush">
                                {filteredItems.length > 0 ? filteredItems.map(item => (
                                    <ListGroup.Item key={item._id} style={{ backgroundColor: 'lightsalmon' }}>
                                        <Container style={{ minWidth: 250 }}>
                                            <Row>
                                                <Col>
                                                    <Stack>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={item.resolved}
                                                            onChange={() => handleResolvedStatus(item._id)}
                                                        />
                                                        <div>
                                                            <b style={{
                                                                textDecoration: item.resolved ? 'line-through' : 'none'
                                                            }}>
                                                                {item.name}
                                                            </b>
                                                        </div>
                                                        {item.quantity && (
                                                            <div>
                                                                {item.quantity} {currentLanguage.id === "CZ" &&
                                                                    ((item.unit === "tsp" && "ČL") ||
                                                                        (item.unit === "tbsp" && "PL") ||
                                                                        (item.unit === "pc" && "ks") ||
                                                                        (item.unit === "c" && "hrn.") || item.unit)
                                                                }
                                                                {currentLanguage.id === "EN" && item.unit}
                                                            </div>
                                                        )}
                                                    </Stack>
                                                </Col>
                                                <Col xs="auto">
                                                    <Button
                                                        className="Item-delete-button"
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteItemShow(item)}
                                                        style={{ display: "flex", alignItems: "center", height: 30 }}
                                                    >
                                                        <Icon path={mdiClose} size={0.7} />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>)
                                ) : (
                                    <ListGroup.Item className="text-muted text-center" style={{ backgroundColor: "lightsalmon" }}>
                                        {currentLanguage.id === "EN" ? "No items" : "Žádné položky"}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card>

            <AddItemModal
                show={addItemShow}
                setAddItemShow={setAddItemShow}
                onItemAdd={handleItemAdded}
                items={items}
            />

            <DeleteItemModal
                show={deleteItemShow}
                setDeleteItemShow={setDeleteItemShow}
                onItemDelete={handleItemDeleted}
                item={selectedItem}
            />
        </>
    )
}

export default ItemList;