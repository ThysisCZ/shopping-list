import { Modal, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useLanguageContext } from '../context/LanguageContext';

function AddListModal({ show, setAddListShow, onListAdd, shoppingLists, currentUser }) {
    const defaultForm = {
        listId: "",
        title: "",
        ownerId: currentUser.id,
        memberIds: [currentUser.id],
        items: [],
        archived: false
    }

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const { currentLanguage } = useLanguageContext();

    const handleClose = () => {
        setAddListShow(false);
        setFormData(defaultForm);
        setValidated(false);
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

        const newList = {
            ...formData
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
                    <Modal.Title>{currentLanguage.id === "EN" ? "Add Shopping List" : "Přidat nákupní seznam"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {currentLanguage.id === "EN" ? "Title" : "Název"}
                            <span style={{ color: "red" }}> *</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                                setField("title", e.target.value);
                                const isDuplicate = shoppingLists.some(
                                    (list) => list.title.toLowerCase() === e.target.value.toLowerCase()
                                );
                                e.target.setCustomValidity(isDuplicate ? "Duplicate" : "");
                            }}
                            maxLength={20}
                            required
                            isInvalid={
                                (validated && formData.title.length === 0) ||
                                (validated && shoppingLists.some((list) => list.title.toLowerCase() === formData.title.toLowerCase()))
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {validated && formData.title.length === 0 && (currentLanguage.id === "EN" ? "This field is required." : "Toto pole je povinné.")}
                            {validated && shoppingLists.some((list) => list.title.toLowerCase() === formData.title.toLowerCase())
                                && (currentLanguage.id === "EN" ? "This list already exists." : "Tento seznam již existuje.")}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div>
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                {currentLanguage.id === "EN" ? "Cancel" : "Zrušit"}
                            </Button>
                            <Button variant="primary" type="submit">
                                {currentLanguage.id === "EN" ? "Add" : "Přidat"}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default AddListModal;

