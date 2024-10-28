import express from "express";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrder,
  verifyOrder,
} from "../controllers/orderController.js";
import verifyToken from "../middlewares/verifytoken.js";
import checkRole from "../middlewares/checkRole.js";

const orderRouter = express.Router();

orderRouter.post("/place", verifyToken, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", verifyToken, userOrder);
orderRouter.get("/list", verifyToken, checkRole("admin"), listOrders);
orderRouter.post("/status", verifyToken, checkRole("admin"), updateStatus);

export default orderRouter;
