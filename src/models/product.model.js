import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../utils/constants.js';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'El precio no puede ser negativo']
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'El stock no puede ser negativo']
    },
    status: {
        type: String,
        enum: Object.values(PRODUCT_STATUS),
        default: PRODUCT_STATUS.AVAILABLE
    },
    thumbnail: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', productSchema);