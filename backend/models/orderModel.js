import mongoose from "mongoose";

const orderModel = mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, default: {} },
  status: { type: String, default: "Order processing" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
});

const Order = mongoose.models.order || mongoose.model("order", orderModel);

export default Order;
