const shoppingListService = require('./shoppingListService');

async function listShoppingListsController(req, res) {
    const shoppingLists = await shoppingListService.listShoppingListsService();
    res.send({ "status": true, "data": shoppingLists });
}

async function createShoppingListController(req, res) {
    try {
        // Get user ID from authenticated token
        const userId = req.user.id;

        // Add user ID to the shopping list data
        const listDetails = {
            ...req.body,
            ownerId: userId,
            memberIds: [userId]
        };

        const shoppingList = await shoppingListService.createShoppingListService(listDetails);

        if (shoppingList) {
            res.send({ "status": true, "message": "List created successfully." });
        } else {
            res.status(400).send({ "status": false, "message": "Error creating list." });
        }
    } catch (e) {
        console.error("Error creating shopping list:", e);
        res.status(500).send({ "status": false, "message": "Server error." });
    }
}

async function getShoppingListController(req, res) {
    try {
        const listId = req.params.id;

        const shoppingList = await shoppingListService.getShoppingListService(listId);

        if (shoppingList) {
            res.status(200).send(shoppingList);
        } else {
            res.status(404).send({ message: 'List not found or access denied.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

async function updateShoppingListController(req, res) {
    try {
        const listId = req.params.id;
        const listBody = req.body;

        const updatedList = await shoppingListService.updateShoppingListService(listId, listBody);

        if (updatedList) {
            res.send({ "status": true, "message": "List updated successfully.", "data": updatedList });
        } else {
            res.status(404).send({ message: 'List not found or access denied.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

async function deleteShoppingListController(req, res) {
    try {
        const listId = req.params.id;

        const shoppingList = await shoppingListService.deleteShoppingListService(listId);

        if (shoppingList) {
            res.send({ "status": true, "message": `List with ID '${listId}' deleted successfully.` });
        } else {
            res.status(404).send({ message: 'List not found or access denied.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Server error.' });
    }
}

module.exports = {
    listShoppingListsController,
    createShoppingListController,
    getShoppingListController,
    updateShoppingListController,
    deleteShoppingListController
}