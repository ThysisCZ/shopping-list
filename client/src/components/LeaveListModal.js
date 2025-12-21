import { Modal, Form, Button } from 'react-bootstrap';
import { useLanguageContext } from '../context/LanguageContext';

function LeaveListModal({ show, setLeaveListShow, onListLeave, list }) {
    const { currentLanguage } = useLanguageContext();

    const handleClose = () => {
        setLeaveListShow(false);
    }

    // Update current data after form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        onListLeave();
        setLeaveListShow(false);
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentLanguage.id === "EN" ? "Leave List" : "Opustit seznam"} ({list?.title})?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div>
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                {currentLanguage.id === "EN" ? "Cancel" : "Zrušit"}
                            </Button>
                            <Button variant="danger" type="submit">
                                {currentLanguage.id === "EN" ? "Leave" : "Opustit"}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default LeaveListModal;