import { Modal, Form, Button } from 'react-bootstrap';
import { useState } from 'react';

function AddListModal({ show, setAddListShow, onListAdd, shoppingLists, currentUserId }) {
    const defaultForm = {
        id: "",
        title: "",
        ownerId: currentUserId,
        memberIds: [currentUserId],
        items: [],
        archived: false
    }

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);

    const handleClose = () => {
        setAddListShow(false);
        setFormData(defaultForm);
        setValidated(false);
    }

    // Find the correct attribute and update its value
    const setField = (key, value) => {
        setFormData(formData => ({ ...formData, [key]: value }))
    }

    // Generate unique ID for new list
    const generateListId = () => {
        const maxId = shoppingLists.reduce((max, list) => {
            const num = parseInt(list.id.replace('list_', ''));
            return num > max ? num : max;
        }, 0);
        return `list_${maxId + 1}`;
    }

    // Update current data after form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        if (!e.target.checkValidity()) return;

        const newList = {
            ...formData,
            id: generateListId()
        };

        onListAdd(newList);

        setFormData(defaultForm);
        setValidated(false);
        setAddListShow(false);
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Shopping List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Title
                            <span style={{ color: "red" }}> *</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                                setField("title", e.target.value);
                                const isDuplicate = shoppingLists.find(
                                    (list) => list.title.toLowerCase() === e.target.value.toLowerCase()
                                );
                                e.target.setCustomValidity(isDuplicate ? "Duplicate" : "");
                            }}
                            maxLength={20}
                            required
                            isInvalid={
                                (validated && formData.title.length === 0) ||
                                (validated && shoppingLists.find((list) => list.title.toLowerCase() === formData.title.toLowerCase()))
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {validated && formData.title.length === 0 && "This field is required."}
                            {validated && shoppingLists.find((list) => list.title.toLowerCase() === formData.title.toLowerCase())
                                && "A list with this title already exists."}
                        </Form.Control.Feedback>
                    </Form.Group>
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

export default AddListModal;

