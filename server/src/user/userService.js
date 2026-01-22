//load the environment variables
require('dotenv').config();

// dependencies
const userModel = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            .then(() => {
                resolve({ success: true, message: 'User registered successfully.' });
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