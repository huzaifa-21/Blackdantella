import Order from "../models/orderModel.js";
import Stripe from "stripe";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Brevo from "@getbrevo/brevo";

const client = new Brevo.TransactionalEmailsApi();
client.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.EMAIL_ID
);

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    // Create a new order document
    const newOrder = new Order({
      userId,
      items,
      amount,
      address,
    });

    // Update the product quantities
    for (const item of items) {
      const { id, color, size, quantity } = item;

      const product = await Product.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product not found: ${id}` });
      }

      const colorVariant = product.colorVariants.find(
        (variant) => variant.color.toLowerCase() === color.toLowerCase()
      );
      if (!colorVariant) {
        return res
          .status(404)
          .json({ success: false, message: `Color not found: ${color}` });
      }

      const sizeVariant = colorVariant.sizes.find((s) => s.size === size);
      if (!sizeVariant) {
        return res
          .status(404)
          .json({ success: false, message: `Size not found: ${size}` });
      }

      if (sizeVariant.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}, color: ${color}, size: ${size}`,
        });
      }

      sizeVariant.quantity -= quantity;
      await product.save();
    }

    await newOrder.save();

    // Clear the user's cart
    await User.findByIdAndUpdate(userId, { cartdata: [] });

    // Send notification email to the admin
    const sendEmail = async () => {
      try {
        const response = await client.sendTransacEmail({
          sender: { email: "huzaifasalah9@gmail.com", name: "Blackdantella" },
          to: [{ email: "blackdantella@gmail.com", name: "Blackdantella" }],
          subject: "Order Notification",
          htmlContent: `
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> ${newOrder._id}</p>
        <p><strong>Amount:</strong> ${amount} AED</p>
        <p><strong>Address:</strong> ${address.address}, ${address.city}, ${
            address.country
          }</p>
        <h3>Order Items:</h3>
        <ul>
          ${items
            .map(
              (item) =>
                `<li>${item.quantity}x ${item.name} (Color: ${item.color}, Size: ${item.size})</li>`
            )
            .join("")}
        </ul>
      `,
        });
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    };

    sendEmail();


    res.json({ success: true, message: "Order placed and email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
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
    const orders = await Order.find({}).sort({ _id: -1 });
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
