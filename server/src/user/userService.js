//load the environment variables
require('dotenv').config();

// dependencies
const userModel = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Register service
module.exports.registerUserService = (userDetails) => {

    return new Promise((resolve, reject) => {

        // First, check if email already exists
        userModel.findOne({ email: userDetails.email })
            .then((existingUser) => {

                if (existingUser) {
                    reject({ message: 'User already exists.' });
                    return;
                }

                // Hash the password
                return bcrypt.hash(userDetails.password, 10);
            })
            .then((hashedPassword) => {

                // Create new user with hashed password
                const userModelData = new userModel();

                userModelData.name = userDetails.name;
                userModelData.email = userDetails.email;
                userModelData.password = hashedPassword;

                return userModelData.save();
            })
            // Login after registering
            .then((user) => {
                // Create JWT token
                const token = jwt.sign(
                    { id: user._id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Return token and user data
                resolve({
                    success: true,
                    token: token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Login service
module.exports.loginUserService = (email, password) => {

    return new Promise((resolve, reject) => {

        let foundUser;

        // Find user by email
        userModel.findOne({ email: email })
            .then((user) => {

                if (!user) {
                    reject({ message: 'Invalid email or password.' });
                    return;
                }

                foundUser = user;

                // Compare password with hashed password
                return bcrypt.compare(password, user.password);
            })
            .then((passwordMatch) => {

                if (!passwordMatch) {
                    reject({ message: 'Invalid email or password.' });
                    return;
                }

                // Create JWT token
                const token = jwt.sign(
                    { id: foundUser._id, email: foundUser.email },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Return token and user data
                resolve({
                    success: true,
                    token: token,
                    user: {
                        id: foundUser._id,
                        name: foundUser.name,
                        email: foundUser.email
                    }
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Get all users
module.exports.listUsersService = () => {

    return new Promise((resolve, reject) => {

        //return all users
        userModel.find({})
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

// Request password reset - generate and send 6-digit code
module.exports.requestPasswordResetService = (email) => {

    return new Promise((resolve, reject) => {

        // Find user by email
        userModel.findOne({ email: email })
            .then((user) => {

                if (!user) {
                    // Don't reveal if user exists or not for security
                    resolve({ success: true, message: 'If the email exists, a reset code has been sent.' });
                    return;
                }

                // Generate 6-digit code
                const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

                // Set expiry to 10 minutes from now
                const resetCodeExpiry = new Date();
                resetCodeExpiry.setMinutes(resetCodeExpiry.getMinutes() + 10);

                // Update user with reset code and expiry
                user.resetCode = resetCode;
                user.resetCodeExpiry = resetCodeExpiry;

                return user.save();
            })
            .then((user) => {
                if (!user) {
                    return Promise.resolve();
                }

                // Send email with reset code
                return emailService.sendPasswordResetCode(user.email, user.resetCode);
            })
            .then(() => {
                resolve({ success: true, message: 'If the email exists, a reset code has been sent.' });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Verify reset code
module.exports.verifyResetCodeService = (email, code) => {

    return new Promise((resolve, reject) => {

        // Find user by email
        userModel.findOne({ email: email })
            .then((user) => {

                if (!user) {
                    reject({ message: 'Invalid reset code.' });
                    return;
                }

                // Check if reset code exists and matches
                if (!user.resetCode || user.resetCode !== code) {
                    reject({ message: 'Invalid reset code.' });
                    return;
                }

                // Check if reset code has expired
                if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date()) {
                    reject({ message: 'Reset code has expired. Please request a new one.' });
                    return;
                }

                resolve({ success: true, message: 'Reset code verified.' });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Reset password with code
module.exports.resetPasswordService = (email, code, newPassword) => {

    return new Promise((resolve, reject) => {

        let foundUser;

        // Find user by email
        userModel.findOne({ email: email })
            .then((user) => {

                if (!user) {
                    reject({ message: 'Invalid reset code.' });
                    return;
                }

                foundUser = user;

                // Check if reset code exists and matches
                if (!user.resetCode || user.resetCode !== code) {
                    reject({ message: 'Invalid reset code.' });
                    return;
                }

                // Check if reset code has expired
                if (!user.resetCodeExpiry || user.resetCodeExpiry < new Date()) {
                    reject({ message: 'Reset code has expired. Please request a new one.' });
                    return;
                }

                // Hash the new password
                return bcrypt.hash(newPassword, 10);
            })
            .then((hashedPassword) => {
                if (!hashedPassword) {
                    return;
                }

                // Update password and clear reset code
                foundUser.password = hashedPassword;
                foundUser.resetCode = null;
                foundUser.resetCodeExpiry = null;

                return foundUser.save();
            })
            .then(() => {
                resolve({ success: true, message: 'Password reset successfully.' });
            })
            .catch((error) => {
                reject(error);
            });
    });
};