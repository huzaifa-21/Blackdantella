import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { configDotenv } from "dotenv";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import cookieParser from "cookie-parser";
import cartRouter from "./routers/cartRouter.js";
import paymentRouter from "./routers/paymentRouter.js";
import orderRouter from "./routers/orderRouter.js";

configDotenv();

connectDB();
// DB Connection

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "https://blackdantella.com",
  "https://www.blackdantella.com",
  "https://admin.blackdantella.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://black-dantella-client.onrender.com",
];

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  "/images",
  express.static(path.join(__dirname, "uploads"), { maxAge: "1y", etag: false })
);
app.use(
  compression({
    level: 6,
    threshold: 1024, // Compress responses larger than 1KB
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// api endpoints
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);

// server listen
app.listen(process.env.PORT || 4001, (req, res) => {
  console.log(`server running at http://localhost:${process.env.PORT}`);
});
