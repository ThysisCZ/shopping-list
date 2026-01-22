const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: false
    },
    resolved: {
        type: Boolean,
        required: false
    },
}, {
    timestamps: true
})

const shoppingListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    memberIds: {
        type: Array,
        required: true
    },
    archived: {
        type: Boolean,
        required: false
    },
    items: [listItemSchema],
}, {
    timestamps: true
});

module.exports = mongoose.model('Shopping List', shoppingListSchema);