import { Modal, Form, Button } from 'react-bootstrap';

function DeleteListModal({ show, setDeleteListShow, onListDelete, list }) {

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
                    <Modal.Title>Delete List ({list?.title})?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div>
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                Cancel
                            </Button>
                            <Button variant="danger" type="submit">
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default DeleteListModal;

