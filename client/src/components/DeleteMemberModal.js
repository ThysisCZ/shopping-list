import { Modal, Form, Button } from 'react-bootstrap';

function DeleteMemberModal({ show, setDeleteMemberShow, onMemberDelete, user }) {

    const handleClose = () => {
        setDeleteMemberShow(false);
    }

    // Update current data after form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        onMemberDelete(user);
        setDeleteMemberShow(false);
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Member ({user?.name})?</Modal.Title>
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

export default DeleteMemberModal;