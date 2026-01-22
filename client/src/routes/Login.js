import styles from "../css/login.module.css";
import { useState } from 'react';
import { Form, Button, Container, Col, Row, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const defaultForm = {
        email: '',
        password: ''
    }

    const URI = "http://localhost:8000";

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [loginCall, setLoginCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useUserContext();
    const navigate = useNavigate();

    const setField = (name, val) => {
        setFormData((formData) => ({ ...formData, [name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        // Check if form is valid before sending
        if (!e.target.checkValidity()) return;

        try {
            setLoginCall({ state: "pending" });
            setMessage({ type: '', text: '' });

            const response = await fetch(`${URI}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setLoginCall({
                    state: "success",
                    data: data
                });

                // Store user data and token in context
                login(data.user, data.token);

                // Show success message
                setMessage({ type: 'success', text: 'Login successful!' });

                // Clear form
                setFormData(defaultForm);
                setValidated(false);

                // Redirect after 1 second
                setTimeout(() => {
                    navigate('/employees');
                }, 1000);
            } else {
                setLoginCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: data.message || 'Login failed' });
            }
        } catch (e) {
            console.error('Login error:', e);
            setLoginCall({ state: "error", error: e });
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    }

    return (
        <div className={styles.loginContainer}>
            <h2>User Login</h2>

            <Container>
                <Row>
                    <Col></Col>
                    <Col md={10}>
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

                            <div className={styles.loginButton}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loginCall.state === "pending"}
                                >
                                    {loginCall.state === "pending" ? "Logging in..." : "Login"}
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

export default Login;