import express from "express";
import multer from "multer";
import {
  addProduct,
  getAllProducts,
  getProducts,
  removeProduct,
} from "../controllers/productController.js";
import verifyToken from "../middlewares/verifytoken.js";
import checkRole from "../middlewares/checkRole.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    // Replace # symbols in the original filename
    const sanitizedFilename = file.originalname.replace(/#/g, "");
    cb(null, Date.now() + "-" + sanitizedFilename);
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
router.get("/all", getAllProducts);
router.post("/remove", verifyToken, checkRole("admin"), removeProduct);

export default router;
