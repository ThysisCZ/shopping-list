import { useState } from 'react';
import { Card, Form, Container, Col, Row, Button, Stack, Accordion, ListGroup } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';
import AddItemModal from './AddItemModal';
import DeleteItemModal from './DeleteItemModal';

function ItemList({ shoppingList, setShoppingList }) {
    const [showResolved, setShowResolved] = useState(false);
    const [addItemShow, setAddItemShow] = useState(false);
    const [deleteItemShow, setDeleteItemShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const items = shoppingList.items;

    // Filter items based on toggle state
    const filteredItems = showResolved ? items :
        items.filter(item => !item.resolved)

    // Update resolved status of an item
    const handleResolvedStatus = (itemId) => {
        const updatedItems = items.map(item =>
            item.itemId === itemId ? { ...item, resolved: !item.resolved } : item
        )

        setShoppingList({ ...shoppingList, items: updatedItems });
    }

    const handleItemAdded = (item) => {
        setShoppingList({
            ...shoppingList,
            items: [...shoppingList.items, item]
        });
    }

    const handleItemDeleted = (item) => {
        const updatedItems = items.filter(i => i.itemId !== item.itemId);
        setShoppingList({ ...shoppingList, items: updatedItems });
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
                <Card.Header style={{ backgroundColor: 'darksalmon' }}>
                    <Container>
                        <Row style={{ marginBottom: 10 }}>
                            <Col>
                                <Form.Check
                                    type="switch"
                                    label="Show resolved"
                                    checked={showResolved}
                                    onChange={() => setShowResolved(!showResolved)}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button variant="success" size="sm" onClick={handleAddItemShow}>
                                    <Icon path={mdiPlus} size={0.7} /> Add
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5 className="mb-0">Items</h5>
                            </Col>
                        </Row>
                    </Container>
                </Card.Header>
                <Accordion style={{ backgroundColor: 'lightsalmon' }}>
                    <Accordion.Header className="Accordion-header" />
                    <Accordion.Body>
                        <ListGroup variant="flush">
                            {filteredItems.map(item => (
                                <ListGroup.Item key={item.itemId} style={{ backgroundColor: 'lightsalmon' }}>
                                    <Container>
                                        <Row>
                                            <Col>
                                                <Stack direction="horizontal" gap={3}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={item.resolved}
                                                        onChange={() => handleResolvedStatus(item.itemId)}
                                                    />
                                                    <b style={{
                                                        textDecoration: item.resolved ? 'line-through' : 'none'
                                                    }}>
                                                        {item.name}
                                                    </b>
                                                    {item.quantity && (
                                                        <div>
                                                            {item.quantity} {item.unit}
                                                        </div>
                                                    )}
                                                </Stack>
                                            </Col>
                                            <Col xs="auto">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteItemShow(item)}
                                                >
                                                    <Icon path={mdiClose} size={0.7} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
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