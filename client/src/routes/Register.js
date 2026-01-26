import styles from "../css/register.module.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Col, Row, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useLanguageContext } from '../context/LanguageContext';
import { useUserContext } from '../context/UserContext';

function Register() {
    const defaultForm = {
        name: '',
        email: '',
        password: ''
    }

    const SERVER_URI = process.env.REACT_APP_SERVER_URI;

    const navigate = useNavigate();
    const { currentLanguage } = useLanguageContext();
    const { login } = useUserContext();
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

            const response = await fetch(`${SERVER_URI}/user/register`, {
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
                );

                // Store user data and token in context
                login(data.user, data.token);

                // Clear form
                setFormData(defaultForm);
                setValidated(false)

                // Redirect after 1 second
                setTimeout(() => {
                    navigate('/list');
                }, 1000);

                console.log("Register", data);
            } else {
                console.error('Registration failed: ' + data.message)
                setRegisterCall({ state: "error", error: data.message });
                setMessage({ type: 'error', text: data.message });
            }
        } catch (e) {
            console.error('Registration error:', e)
            setRegisterCall({ state: "error", error: e })
            setMessage({ type: 'error', text: currentLanguage.id === "EN" ? "Network error. Please try again." : "Chyba sítě. Zkuste to prosím znovu." });
        }
    }

    return (
        <div className={styles.registerContainer}>
            <h2>{currentLanguage.id === "EN" ? "Sign Up" : "Registrace"}</h2>

            <Container>
                <Row className="justify-content-center">
                    <Col xs={10}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Stack gap={2}>
                                <Form.Group>
                                    <div className={styles.formLabel}>
                                        <Form.Label>{currentLanguage.id === "EN" ? "Username" : "Uživatelské jméno"}:</Form.Label>
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
                                        {validated && formData.name.length === 0 && (currentLanguage.id === "EN" ? "This field is required." : "Toto pole je povinné.")}
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

                            <div className={styles.authButton} style={{ marginTop: 25 }}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={registerCall.state === "pending"}
                                >
                                    {registerCall.state === "pending" ?
                                        currentLanguage.id === "EN" ? "Signing up..." : "Registrování..." :
                                        currentLanguage.id === "EN" ? "Sign Up" : "Registrovat se"}
                                </Button>
                            </div>

                            <div className={styles.loginText}>
                                {currentLanguage.id === "EN" ? "Already have an account?" : "Máte vytvořený účet?"}
                            </div>

                            <div className={styles.authButton}>
                                <Button
                                    variant="secondary"
                                    type="submit"
                                    disabled={registerCall.state === "pending"}
                                    onClick={() => navigate("/login")}
                                >
                                    {currentLanguage.id === "EN" ? "Login" : "Přihlásit se"}
                                </Button>
                            </div>
                        </Form>
                    </Col>
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