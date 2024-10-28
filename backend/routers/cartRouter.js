import express from "express";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "../controllers/cartController.js";
import verifyToken from "../middlewares/verifytoken.js";

const cartRouter = express.Router();

cartRouter.get("/", verifyToken, getCart);
cartRouter.post("/add", verifyToken, addToCart);
cartRouter.post("/remove", verifyToken, removeFromCart);

export default cartRouter;
