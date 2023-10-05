import mongoose, { Schema, Types, model } from "mongoose";


const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: [String], required: true },
    address: { type: String },
    note: String,
    products: [
        {
            name: { type: String, required: true },
            productId: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, required: true },
            unitPrice: { type: Number, required: true },
            finalPrice: { type: Number, required: true },
        }
    ],
    couponId: { type: Types.ObjectId, ref: "Coupon" },
    subtotal: { type: Number, required: true },
    totalPillAmount: { type: Number, required: true },
    paymentType: {
        type: String,
        default: 'cash',
        enum: ['cash', 'card']
    },
    status: {
        type: String,
        default: "placed",
        enum: ['waitForPayment', 'placed', 'onWay', 'canceled', 'rejected', 'delivered']
    },
    reason: String
}, {
    timestamps: true
})
const orderModel = mongoose.models.Order || model("Order", orderSchema)

export default orderModel

