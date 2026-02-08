import mongoose, { Document, Schema } from "mongoose";
import { IAddress } from "./Address";


export interface IOrderItem extends Document {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: mongoose.Types.ObjectId | IAddress;
    paymentStatus: 'pending' | 'complete' | 'failed';
    paymentMethod: string;
   paymentDetails: Record<string, any>;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
}
const orderItemsSchema = new Schema<IOrderItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
});

const OderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemsSchema],
    totalAmount: { type: Number },
    shippingAddress: { type: Schema.Types.ObjectId, ref: 'Address' },
    paymentStatus: {
        type: String,
        enum: ['pending', 'complete', 'failed'],
        default: 'pending'
    },
    paymentMethod: { type: String },
  paymentDetails: { type: Schema.Types.Mixed, default: {} },
    status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OderSchema);