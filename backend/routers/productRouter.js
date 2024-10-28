import express from "express";
import multer from "multer";
import {
  addProduct,
  getProducts,
  removeProduct,
} from "../controllers/productController.js";
import verifyToken from "../middlewares/verifytoken.js";
import checkRole from "../middlewares/checkRole.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add",
  upload.array("images", 25),
  verifyToken,
  checkRole("admin"),
  addProduct
);
router.get("/", getProducts);
router.post("/remove", verifyToken, checkRole("admin"), removeProduct);

export default router;
