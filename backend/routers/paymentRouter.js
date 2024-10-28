import { handlePayment } from "../controllers/paymentContoller.js";
import express from "express";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-intent", handlePayment);

export default paymentRouter;
