import mongoose from 'mongoose';
import { DELIVERY_STATUS } from '../utils/constants.js';

const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    courier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: Object.values(DELIVERY_STATUS),
        default: DELIVERY_STATUS.ASSIGNED
    }
}, {
    timestamps: true
});

export default mongoose.model('Delivery', deliverySchema);