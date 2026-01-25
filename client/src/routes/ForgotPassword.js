import styles from "../css/forgotPassword.module.css";
import { useState } from 'react';
import { Form, Button, Container, Col, Row, Stack } from 'react-bootstrap';
import { useLanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const defaultForm = {
        email: ''
    }

    const SERVER_URI = process.env.REACT_APP_SERVER_URI;

    const navigate = useNavigate();
    const { currentLanguage } = useLanguageContext();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [resetCall, setResetCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });

    const setField = (name, val) => {
        setFormData((formData) => ({ ...formData, [name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setValidated(true)

        // Check if form is valid before sending
        if (!e.target.checkValidity()) return;

        try {
            setResetCall({ state: "pending" })
            setMessage({ type: '', text: '' });

            const response = await fetch(`${SERVER_URI}/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setResetCall({
                    state: "success",
                    data: data
                })

                setMessage({ 
                    type: 'success', 
                    text: currentLanguage.id === "EN" 
                        ? "If the email exists, a reset code has been sent to your email." 
                        : "Pokud email existuje, byl vám odeslán resetovací kód." 
                });

                // Navigate to reset password page after 2 seconds
                setTimeout(() => {
                    navigate('/reset-password', { state: { email: formData.email } });
                }, 2000);
            } else {
                console.error('Password reset request failed: ' + data.message)
                setResetCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: data.message });
            }
        } catch (e) {
            console.error('Password reset request error:', e)
            setResetCall({ state: "error", error: e })
            setMessage({ type: 'error', text: currentLanguage.id === "EN" ? "Network error. Please try again." : "Chyba sítě. Zkuste to prosím znovu." });
        }
    }

    return (
        <div className={styles.forgotPasswordContainer}>
            <h2>{currentLanguage.id === "EN" ? "Forgot Password" : "Zapomenuté heslo"}</h2>

            <Container>
                <Row className="justify-content-center">
                    <Col xs={10}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Stack gap={3}>
                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setField("email", e.target.value);
                                        }}
                                        maxLength={60}
                                        required
                                        isInvalid={
                                            validated && formData.email.length === 0
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validated && formData.email.length === 0 && (currentLanguage.id === "EN" ? "This field is required." : "Toto pole je povinné.")}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Stack>

                            <div className={styles.authButton}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={resetCall.state === "pending"}
                                >
                                    {resetCall.state === "pending" ?
                                        currentLanguage.id === "EN" ? "Sending..." : "Odesílání..." :
                                        currentLanguage.id === "EN" ? "Send Reset Code" : "Odeslat resetovací kód"}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>

                <div className={styles.authButton}>
                    <Button
                        variant="secondary"
                        type="button"
                        disabled={resetCall.state === "pending"}
                        onClick={() => navigate("/login")}
                    >
                        {currentLanguage.id === "EN" ? "Back to Login" : "Zpět na přihlášení"}
                    </Button>
                </div>
            </Container>

            {message.text && (
                <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default ForgotPassword;

