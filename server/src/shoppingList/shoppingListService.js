//dependencies
const shoppingListModel = require('./shoppingListModel');

//communicate with the database
module.exports.listShoppingListsService = () => {

    return new Promise((resolve, reject) => {

        //return all lists
        shoppingListModel.find({})
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.createShoppingListService = (listDetails) => {

    return new Promise((resolve, reject) => {

        const shoppingListModelData = new shoppingListModel();

        shoppingListModelData.title = listDetails.title;
        shoppingListModelData.ownerId = listDetails.ownerId;
        shoppingListModelData.memberIds = listDetails.memberIds;
        shoppingListModelData.archived = false;
        shoppingListModelData.items = [];

        shoppingListModelData.save()
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.getShoppingListService = (listId) => {

    return new Promise((resolve, reject) => {

        // Find list by ID
        shoppingListModel.findOne({ _id: listId })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.updateShoppingListService = (listId, listBody) => {

    return new Promise((resolve, reject) => {

        // Update shopping list
        shoppingListModel.findOneAndUpdate(
            { _id: listId },
            { $set: listBody },
            { new: true }
        )
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

module.exports.deleteShoppingListService = (listId) => {

    return new Promise((resolve, reject) => {

        // Delete shopping list
        shoppingListModel.findOneAndDelete({ _id: listId })
            .then((result) => {
                resolve(result);
            })
            .catch(() => {
                reject(false);
            });
    });
}

