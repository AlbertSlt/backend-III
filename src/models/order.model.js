import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_PRIORITY } from '../utils/constants.js';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La cantidad debe ser al menos 1']
        }
    }],
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.PENDING
    },
    priority: {
        type: String,
        enum: Object.values(ORDER_PRIORITY),
        default: ORDER_PRIORITY.MEDIUM
    }
}, {
    timestamps: true
});

export default mongoose.model('Order', orderSchema);