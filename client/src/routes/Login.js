import styles from "../css/login.module.css";
import { useState, useEffect } from 'react';
import { Form, Button, Container, Col, Row, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useUserContext } from '../context/UserContext';
import { useLanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const defaultForm = {
        email: '',
        password: ''
    }

    const SERVER_URI = process.env.REACT_APP_SERVER_URI;

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [loginCall, setLoginCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login, user } = useUserContext();
    const { currentLanguage } = useLanguageContext();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/list');
        }
    }, [user, navigate]);

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

            const response = await fetch(`${SERVER_URI}/user/login`, {
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

                // Clear form
                setFormData(defaultForm);
                setValidated(false);

                // Redirect after 1 second
                setTimeout(() => {
                    navigate('/list');
                }, 1000);
            } else {
                setLoginCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: currentLanguage.id === "EN" ? "Incorrect email or password." : "Nesprávný email nebo heslo." });
            }
        } catch (e) {
            console.error('Login error:', e);
            setLoginCall({ state: "error", error: e });
            setMessage({ type: 'error', text: currentLanguage.id === "EN" ? "Network error. Please try again." : "Chyba sítě. Zkuste to prosím znovu." });
        }
    }

    return (
        <div className={styles.loginContainer}>
            <h2>{currentLanguage.id === "EN" ? "Login" : "Přihlášení"}</h2>

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

                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>{currentLanguage.id === "EN" ? "Password" : "Heslo"}:</Form.Label>
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
                                            {validated && formData.password.length === 0 && (currentLanguage.id === "EN" ? "This field is required." : "Toto pole je povinné.")}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Stack>

                            <div className={styles.authButton}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loginCall.state === "pending"}
                                >
                                    {loginCall.state === "pending" ?
                                        currentLanguage.id === "EN" ? "Logging in..." : "Přihlašování..." :
                                        currentLanguage.id === "EN" ? "Login" : "Přihlásit se"}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button className={styles.link} onClick={() => navigate("/forgot-password")}>{currentLanguage.id === "EN" ? "Forgot password?" : "Zapomněli jste heslo?"}</button>
                </div>

                <div className={styles.authButton}>
                    <Button
                        variant="secondary"
                        type="submit"
                        disabled={loginCall.state === "pending"}
                        onClick={() => navigate("/register")}
                    >
                        {currentLanguage.id === "EN" ? "Sign Up" : "Registrovat se"}
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

export default Login;