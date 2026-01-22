import styles from "../css/register.module.css";
import { useState } from 'react';
import { Form, Button, Container, Col, Row, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

function Register() {
    const defaultForm = {
        name: '',
        email: '',
        password: ''
    }

    const URI = "http://localhost:8000";

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [registerCall, setRegisterCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

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
            setRegisterCall({ state: "pending" })
            setMessage({ type: '', text: '' });

            const response = await fetch(`${URI}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setRegisterCall(
                    {
                        state: "success",
                        data: [registerCall.data, data]
                    }
                )

                // Show success message
                setMessage({ type: 'success', text: 'Registration successful!' });

                // Clear form
                setFormData(defaultForm);
                setValidated(false)

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                    setRegisterCall({ state: "inactive" });
                }, 3000);
            } else {
                console.error('Registration failed: ' + data.message)
                setRegisterCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: data.message });
            }
        } catch (e) {
            console.error('Registration error:', e)
            setRegisterCall({ state: "error", error: e })
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    }

    return (
        <div className={styles.registerContainer}>
            <h2>User Registration</h2>

            <Container>
                <Row>
                    <Col></Col>
                    <Col md={10}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Stack gap={2}>
                                <Form.Group>
                                    <div className={styles.formLabel}>
                                        <Form.Label>Name:</Form.Label>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setField("name", e.target.value);
                                        }}
                                        maxLength={20}
                                        required
                                        isInvalid={
                                            validated && formData.name.length === 0
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validated && formData.name.length === 0 && "This field is required."}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <div className={styles.formLabel}>
                                        <Form.Label>Email:</Form.Label>
                                    </div>
                                    <Form.Control
                                        type="text"
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
                                        {validated && formData.email.length === 0 && "This field is required."}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>Password:</Form.Label>
                                    <div className={styles.passwordInputWrapper}>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => {
                                                setField("password", e.target.value);
                                            }}
                                            maxLength={20}
                                            required
                                            isInvalid={
                                                validated && formData.password.length === 0
                                            }
                                            className={styles.passwordInput}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={styles.togglePasswordBtn}
                                        >
                                            {showPassword ? <Icon path={mdiEyeOff} size={1} /> : <Icon path={mdiEye} size={1} />}
                                        </button>
                                        <Form.Control.Feedback type="invalid" className={styles.passwordFeedback}>
                                            {validated && formData.password.length === 0 && "This field is required."}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Stack>

                            <div className={styles.registerButton}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Register
                                </Button>
                            </div>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

            {message.text && (
                <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default Register