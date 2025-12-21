import { Modal, Form, Button } from 'react-bootstrap';
import { useLanguageContext } from '../context/LanguageContext';

function DeleteListModal({ show, setDeleteListShow, onListDelete, list }) {
    const { currentLanguage } = useLanguageContext();

    const handleClose = () => {
        setDeleteListShow(false)
    }

    // Update current data after form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        onListDelete(list.listId);
        setDeleteListShow(false);
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentLanguage.id === "EN" ? "Delete List" : "Smazat seznam"} ({list?.title})?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div>
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                {currentLanguage.id === "EN" ? "Cancel" : "Zrušit"}
                            </Button>
                            <Button variant="danger" type="submit">
                                {currentLanguage.id === "EN" ? "Delete" : "Smazat"}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default DeleteListModal;

