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
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(PRODUCT_STATUS),
        default: PRODUCT_STATUS.AVAILABLE
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', productSchema);