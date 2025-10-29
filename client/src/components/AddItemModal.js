import { Modal, Form, Col, Row, Button } from 'react-bootstrap';
import { useState } from 'react';

function AddItemModal({ show, setAddItemShow, onItemAdd, items }) {
    const defaultForm = {
        id: "",
        name: "",
        quantity: "",
        unit: "",
        resolved: false
    }

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);

    const handleClose = () => {
        setAddItemShow(false)
    }

    // Find the correct attribute and update its value
    const setField = (key, value) => {
        setFormData(formData => ({ ...formData, [key]: value }))
    }

    // Update current data after form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        if (!e.target.checkValidity()) return;

        onItemAdd(formData);

        setFormData(defaultForm);
        setValidated(false);
        setAddItemShow(false);
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Name
                            <span style={{ color: "red" }}> *</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setField("name", e.target.value);
                                const isDuplicate = items.find(
                                    (item) => item.name.toLowerCase() === e.target.value.toLowerCase()
                                );
                                e.target.setCustomValidity(isDuplicate ? "Duplicate" : "");
                            }}
                            maxLength={20}
                            required
                            isInvalid={
                                (validated && formData.name.length === 0) ||
                                (validated && items.find((item) => item.name.toLowerCase() === formData.name.toLowerCase()))
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {validated && formData.name.length === 0 && "This field is required."}
                            {validated && items.find((item) => item.name.toLowerCase() === formData.name.toLowerCase())
                                && "This item already exists."}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>
                                Quantity
                                <span style={{ color: "red" }}> *</span>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => {
                                    setField("quantity", parseFloat(e.target.value));
                                }}
                                onBlur={(e) => {
                                    let value = e.target.value;

                                    // Remove leading zeros
                                    const parsed = parseFloat(value);
                                    e.target.value = parsed;
                                    setField("quantity", parsed);

                                    // Input length limit
                                    const isLong = parseFloat(value).toString().length > 7
                                    e.target.setCustomValidity(isLong ? "Long" : "");
                                }}
                                min={0.1}
                                step={0.1}
                                required
                                isInvalid={
                                    (validated && (formData.quantity === "" || isNaN(formData.quantity))) ||
                                    (validated && parseFloat(formData.quantity) < 0.1) ||
                                    (validated && parseFloat(formData.quantity).toString().length > 7)
                                }
                            />
                            <Form.Control.Feedback type="invalid">
                                {validated && (formData.quantity === "" || isNaN(formData.quantity)) && "This field is required."}
                                {validated && (parseFloat(formData.quantity) < 0.1 ||
                                    parseFloat(formData.quantity).toString().length > 7) && "Input a valid number."}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Unit</Form.Label>
                            <Form.Select
                                value={formData.unit}
                                onChange={(e) => {
                                    setField("unit", e.target.value);
                                }}
                            >
                                <option value={""}>---</option>
                                <option value={"ml"}>mililiter</option>
                                <option value={"dl"}>deciliter</option>
                                <option value={"l"}>liter</option>
                                <option value={"g"}>gram</option>
                                <option value={"dkg"}>decagram</option>
                                <option value={"kg"}>kilogram</option>
                                <option value={"tsp"}>teaspoon</option>
                                <option value={"tsp"}>tablespoon</option>
                                <option value={"fl oz"}>fluid ounce</option>
                                <option value={"pc"}>piece</option>
                                <option value={"c"}>cup</option>
                                <option value={"pt"}>pint</option>
                                <option value={"qt"}>quart</option>
                                <option value={"gal"}>gallon</option>
                                <option value={"lb"}>pound</option>
                                <option value={"oz"}>ounce</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div>
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default AddItemModal;