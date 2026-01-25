// dependencies
const mongoose = require('mongoose');

// define user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 60,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    resetCode: {
        type: String,
        default: null
    },
    resetCodeExpiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// export model
module.exports = mongoose.model('User', userSchema);