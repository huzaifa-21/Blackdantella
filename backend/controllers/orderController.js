import Order from "../models/orderModel.js";
import Stripe from "stripe";
import user from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const frontend_url = process.env.FRONTEND_URL;
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const newOrder = new Order({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await user.findByIdAndUpdate(userId, { cartdata: [] });
    /**
      * ! this comment bellow is ready for when i add stripe account 
    */
    
    // const line_items = items.map((item) => ({
    //   price_data: {
    //     currency: "aed",
    //     product_data: {
    //       name: item.name,
    //       description: `Size: ${item.size}`,
    //     },
    //     unit_amount: item.price * 100,
    //   },
    //   quantity: item.quantity,
    // }));

    // line_items.push({
    //   price_data: {
    //     currency: "aed",
    //     product_data: {
    //       name: "Delivery charges",
    //     },
    //     unit_amount: 10 * 100,
    //   },
    //   quantity: 1,
    // });

    // const session = await stripe.checkout.sessions.create({
    //   line_items,
    //   mode: "payment",
    //   success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    //   cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    // });

    res.json({ success: true, message: "Order placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not paid" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get the user orders
const userOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// list orders for the admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update the status of the order
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, verifyOrder, userOrder, listOrders, updateStatus };
