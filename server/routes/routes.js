//dependencies
const express = require('express');
const userController = require('../src/user/userController');
const shoppingListController = require('../src/shoppingList/shoppingListController');
const { authenticateToken } = require('../src/middleware/authMiddleware');

//initialize router
const router = express.Router();

//routes for HTTP requests
router.route('/user/register').post(userController.registerUserController);
router.route('/user/login').post(userController.loginUserController);
router.route('/user/list').get(authenticateToken, userController.listUsersController);


router.route('/shoppingList/list').get(authenticateToken, shoppingListController.listShoppingListsController);
router.route('/shoppingList/create').post(authenticateToken, shoppingListController.createShoppingListController);
router.route('/shoppingList/get/:id').get(authenticateToken, shoppingListController.getShoppingListController);
router.route('/shoppingList/update/:id').patch(authenticateToken, shoppingListController.updateShoppingListController);
router.route('/shoppingList/delete/:id').delete(authenticateToken, shoppingListController.deleteShoppingListController);

//export router
module.exports = router;