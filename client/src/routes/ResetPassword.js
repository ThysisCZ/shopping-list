import styles from "../css/resetPassword.module.css";
import { useState, useEffect } from 'react';
import { Form, Button, Container, Col, Row, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useLanguageContext } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
    const defaultForm = {
        code: '',
        newPassword: '',
        confirmPassword: ''
    }

    const SERVER_URI = process.env.REACT_APP_SERVER_URI;

    const navigate = useNavigate();
    const location = useLocation();
    const { currentLanguage } = useLanguageContext();
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(defaultForm);
    const [resetCall, setResetCall] = useState({ state: "inactive" });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Get email from location state or navigate back if not available
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        } else {
            // If no email in state, redirect to forgot password
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const setField = (name, val) => {
        setFormData((formData) => ({ ...formData, [name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setValidated(true)

        // Check if form is valid before sending
        if (!e.target.checkValidity()) return;

        // Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ 
                type: 'error', 
                text: currentLanguage.id === "EN" 
                    ? "Passwords do not match." 
                    : "Hesla se neshodují." 
            });
            return;
        }

        try {
            setResetCall({ state: "pending" })
            setMessage({ type: '', text: '' });

            // First verify the code
            const verifyResponse = await fetch(`${SERVER_URI}/user/verify-reset-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    code: formData.code
                })
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                setResetCall({ state: "error", error: verifyData.message });
                setMessage({ type: 'error', text: verifyData.message || (currentLanguage.id === "EN" ? "Invalid reset code." : "Neplatný resetovací kód.") });
                return;
            }

            // If code is valid, reset the password
            const resetResponse = await fetch(`${SERVER_URI}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    code: formData.code,
                    newPassword: formData.newPassword
                })
            });

            const resetData = await resetResponse.json();

            if (resetResponse.ok) {
                setResetCall({
                    state: "success",
                    data: resetData
                })

                setMessage({ 
                    type: 'success', 
                    text: currentLanguage.id === "EN" 
                        ? "Password reset successfully! Redirecting to login..." 
                        : "Heslo bylo úspěšně změněno! Přesměrování na přihlášení..." 
                });

                // Clear form
                setFormData(defaultForm);
                setValidated(false);

                // Navigate to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                console.error('Password reset failed: ' + resetData.message)
                setResetCall({ state: "error", error: resetData.message });
                setMessage({ type: 'error', text: resetData.message || (currentLanguage.id === "EN" ? "Failed to reset password." : "Nepodařilo se změnit heslo.") });
            }
        } catch (e) {
            console.error('Password reset error:', e)
            setResetCall({ state: "error", error: e })
            setMessage({ type: 'error', text: currentLanguage.id === "EN" ? "Network error. Please try again." : "Chyba sítě. Zkuste to prosím znovu." });
        }
    }

    return (
        <div className={styles.resetPasswordContainer}>
            <h2>{currentLanguage.id === "EN" ? "Reset Password" : "Obnovení hesla"}</h2>

            <Container>
                <Row className="justify-content-center">
                    <Col xs={10}>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Stack gap={3}>
                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>
                                        {currentLanguage.id === "EN" ? "Reset Code" : "Resetovací kód"}:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => {
                                            // Only allow numbers and limit to 6 digits
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setField("code", value);
                                        }}
                                        maxLength={6}
                                        required
                                        placeholder={currentLanguage.id === "EN" ? "Enter 6-digit code" : "Zadejte 6místný kód"}
                                        isInvalid={
                                            validated && formData.code.length !== 6
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {validated && formData.code.length !== 6 && (currentLanguage.id === "EN" ? "Please enter a 6-digit code." : "Zadejte prosím 6místný kód.")}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>
                                        {currentLanguage.id === "EN" ? "New Password" : "Nové heslo"}:
                                    </Form.Label>
                                    <div className={styles.passwordInputWrapper}>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={(e) => {
                                                setField("newPassword", e.target.value);
                                            }}
                                            maxLength={20}
                                            required
                                            isInvalid={
                                                validated && formData.newPassword.length === 0
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
                                            {validated && formData.newPassword.length === 0 && (currentLanguage.id === "EN" ? "This field is required." : "Toto pole je povinné.")}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>
                                        {currentLanguage.id === "EN" ? "Confirm Password" : "Potvrďte heslo"}:
                                    </Form.Label>
                                    <div className={styles.passwordInputWrapper}>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => {
                                                setField("confirmPassword", e.target.value);
                                            }}
                                            maxLength={20}
                                            required
                                            isInvalid={
                                                validated && formData.confirmPassword.length === 0
                                            }
                                            className={styles.passwordInput}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={styles.togglePasswordBtn}
                                        >
                                            {showConfirmPassword ? <Icon path={mdiEyeOff} size={1} /> : <Icon path={mdiEye} size={1} />}
                                        </button>
                                        <Form.Control.Feedback type="invalid" className={styles.passwordFeedback}>
                                            {validated && formData.confirmPassword.length === 0 && (currentLanguage.id === "EN" ? "This field is required." : "Toto pole je povinné.")}
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Stack>

                            <div className={styles.authButton}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={resetCall.state === "pending"}
                                >
                                    {resetCall.state === "pending" ?
                                        currentLanguage.id === "EN" ? "Resetting..." : "Obnovování..." :
                                        currentLanguage.id === "EN" ? "Reset Password" : "Obnovit heslo"}
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
                        onClick={() => navigate("/forgot-password")}
                    >
                        {currentLanguage.id === "EN" ? "Back" : "Zpět"}
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

export default ResetPassword;

