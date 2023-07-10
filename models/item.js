const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Item Schema
 */

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        references: 'user'
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    }
});