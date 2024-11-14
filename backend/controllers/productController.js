import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp"; // Import sharp for image processing
import heicConvert from "heic-convert"; // Import heic-convert for HEIC files

// const setCorsHeaders = (res) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://admin.blackdantella.com"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
// };

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({createdAt:-1});
    res.status(200).send({ success: true, data: products });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { limit = 12, page = 1, category = "all" } = req.query;
    const skip = (page - 1) * limit;

    const query = category === "all" ? {} : { category };
    const totalProducts = await Product.countDocuments(query); // Total products based on the query
    const products = await Product.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res
      .status(200)
      .send({ success: true, data: products, total: totalProducts });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, colorVariants } = req.body;
    const colorVariantsData = JSON.parse(colorVariants);

    for (const variant of colorVariantsData) {
      if (!variant.color) {
        console.error("Color is missing for variant:", variant);
        setCorsHeaders(res); // Add CORS headers
        return res.status(400).send({
          success: false,
          message: "Color is missing for one of the variants.",
        });
      }

      variant.images = [];
      const matchingFiles = req.files.filter((file) =>
        file.originalname.startsWith(variant.color)
      );

      if (matchingFiles.length === 0) {
        console.warn(`No matching files for color: ${variant.color}`);
        setCorsHeaders(res); // Add CORS headers
        return res.status(400).send({
          success: false,
          message: `No images found for color: ${variant.color}`,
        });
      }

      for (const file of matchingFiles) {
        if (file.size > 20 * 1024 * 1024) {
          // 20MB limit
          console.warn(`File too large: ${file.originalname}`);
          setCorsHeaders(res); // Add CORS headers
          return res.status(400).send({
            success: false,
            message: `File ${file.originalname} exceeds the maximum size limit of 5MB.`,
          });
        }
        const sanitizedFilename = file.originalname.replace(/#/g, "");
        const webpFileName = `${Date.now()}-${sanitizedFilename
          .split(".")
          .slice(0, -1)
          .join(".")}.webp`;
        const webpFilePath = path.join("uploads", webpFileName);

        try {
          let imageBuffer;

          if (
            file.mimetype === "image/heic" ||
            file.mimetype === "image/heif"
          ) {
            const jpegBuffer = await heicConvert({
              buffer: fs.readFileSync(file.path),
              format: "JPEG",
            });
            imageBuffer = jpegBuffer;
          } else {
            imageBuffer = fs.readFileSync(file.path);
          }

          // Compress with sharp, lower quality, and optional resizing
          await sharp(imageBuffer)
            .resize({ width: 800 }) // Optional resizing, e.g., to 800px width
            .webp({ quality: 50 }) // Set quality lower for greater compression
            .toFile(webpFilePath);

          fs.unlinkSync(file.path); // Remove original file after processing

          // Add processed image URL
          variant.images.push({
            url: `/images/${webpFileName}`,
            description: "",
          });
          console.log(`Image processed and URL added: ${webpFileName}`);
        } catch (err) {
          console.error(`Error converting image: ${err.message}`);
        }
      }

      variant.sizes = variant.sizes.filter((size) => size.checked);
    }

    console.log("Processed Color Variants Data:", colorVariantsData);

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      colorVariants: colorVariantsData,
    });

    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    console.error(`Error adding product: ${error.message}`);
    setCorsHeaders(res); // Add CORS headers
    res.status(400).send({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    // Delete images from the filesystem
    product.colorVariants.forEach((variant) => {
      variant.images.forEach((image) => {
        // Ensure the file path is correctly constructed
        const imagePath = path.join(
          __dirname,
          "../uploads",
          image.url.replace("/images/", "")
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image file
        }
      });
    });

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    res
      .status(200)
      .send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export { addProduct, getProducts, removeProduct,getAllProducts };
