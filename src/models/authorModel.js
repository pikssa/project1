
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        required: true
    },
    fname: {
        type: String,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        unique: true,
        trim:true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)


