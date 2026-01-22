// dependencies
const userService = require('./userService');

// Register controller
async function registerUserController(req, res) {

    try {
        const userDetails = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        const result = await userService.registerUserService(userDetails);

        res.status(201).send(result);

    } catch (error) {
        res.status(400).send({ success: false, message: 'Registration failed.' });
    }
};

// Login controller
async function loginUserController(req, res) {

    try {
        const { email, password } = req.body;

        const result = await userService.loginUserService(email, password);

        res.status(200).send(result);

    } catch (error) {
        res.status(401).send({ success: false, message: 'Login failed.' });
    }
};

async function listUsersController(req, res) {
    const users = await userService.listUsersService();
    res.send({ "status": true, "data": users });
}

module.exports = {
    registerUserController,
    loginUserController,
    listUsersController
}