const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    }, 
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    }, 
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    }, 
    sold: {
        type: Number,
        default: 0
    }, 
    image: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);