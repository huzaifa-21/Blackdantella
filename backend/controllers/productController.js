// import Product from "../models/productModel.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // const getProducts = async (req, res) => {
// //   try {
// //     const { limit = 10, page = 1 } = req.query;
// //     const skip = (page - 1) * limit;

// //     const products = await Product.find({}).limit(limit).skip(skip);
// //     res.status(200).send({ success: true, data: products });
// //   } catch (error) {
// //     res.status(400).send({ success: false, message: error.message });
// //   }
// // };

// const getProducts = async (req, res) => {
//   try {
//     const { limit = 10, page = 1, category = "all" } = req.query;
//     const skip = (page - 1) * limit;

//     const query = category === "all" ? {} : { category };
//     const totalProducts = await Product.countDocuments(query); // Total products based on the query
//     const products = await Product.find(query)
//       .skip(skip)
//       .limit(parseInt(limit));

//     res
//       .status(200)
//       .send({ success: true, data: products, total: totalProducts });
//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// };

// const addProduct = async (req, res) => {
//   try {
//     const { name, price, description, category, colorVariants } = req.body;
//     const colorVariantsData = JSON.parse(colorVariants);

//     colorVariantsData.forEach((variant) => {
//       variant.images = req.files
//         .filter((file) => file.originalname.startsWith(variant.color))
//         .map((file) => ({
//           url: `/images/${file.filename}`,
//           description: "",
//         }));
//       variant.sizes = variant.sizes.filter((size) => size.checked);
//     });

//     const newProduct = new Product({
//       name,
//       price,
//       description,
//       category,
//       colorVariants: colorVariantsData,
//     });

//     await newProduct.save();
//     res.status(201).send({ success: true, data: newProduct });
//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// };

// const removeProduct = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     // Find the product by ID
//     const product = await Product.findById(id);
//     if (!product) {
//       return res
//         .status(404)
//         .send({ success: false, message: "Product not found" });
//     }

//     // Delete images from the filesystem
//     product.colorVariants.forEach((variant) => {
//       variant.images.forEach((image) => {
//         // Ensure the file path is correctly constructed
//         const imagePath = path.join(
//           __dirname,
//           "../uploads",
//           image.url.replace("/images/", "")
//         );

//         if (fs.existsSync(imagePath)) {
//           fs.unlinkSync(imagePath); // Delete the image file
//         }
//       });
//     });

//     // Delete the product from the database
//     await Product.findByIdAndDelete(id);

//     res
//       .status(200)
//       .send({ success: true, message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// };

// export { addProduct, getProducts, removeProduct };

import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp"; // Import sharp for image processing
import heicConvert from "heic-convert"; // Import heic-convert for HEIC files

const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, category = "all" } = req.query;
    const skip = (page - 1) * limit;

    const query = category === "all" ? {} : { category };
    const totalProducts = await Product.countDocuments(query); // Total products based on the query
    const products = await Product.find(query)
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

    const imageProcessingPromises = [];

    colorVariantsData.forEach((variant) => {
      if (!variant.color) {
        console.error("Color is missing for variant:", variant);
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
        return res.status(400).send({
          success: false,
          message: `No images found for color: ${variant.color}`,
        });
      }

      matchingFiles.forEach((file) => {
        if (file.size > 20 * 1024 * 1024) {
          // Limit file size to 5MB
          console.warn(`File too large: ${file.originalname}`);
          return res.status(400).send({
            success: false,
            message: `File ${file.originalname} exceeds the maximum size limit of 5MB.`,
          });
        }

        const webpFileName = `${Date.now()}-${file.originalname
          .split(".")
          .slice(0, -1)
          .join(".")}.webp`;
        const webpFilePath = path.join("uploads", webpFileName);

        const processImage = async () => {
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

            await sharp(imageBuffer).webp({ quality: 80 }).toFile(webpFilePath);
            fs.unlinkSync(file.path); // Remove original file after processing
            variant.images.push({
              url: `/images/${webpFileName}`,
              description: "",
            });
            console.log(`Image processed and URL added: ${webpFileName}`);
          } catch (err) {
            console.error(`Error converting image: ${err.message}`);
            // Handle error gracefully, possibly notify the user
          }
        };

        imageProcessingPromises.push(processImage());
      });

      variant.sizes = variant.sizes.filter((size) => size.checked);
    });

    await Promise.all(imageProcessingPromises); // Wait for all image processing to finish

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
    res.status(400).send({ success: false, message: error.message });
  }
};

// const addProduct = async (req, res) => {
//   try {
//     const { name, price, description, category, colorVariants } = req.body;
//     const colorVariantsData = JSON.parse(colorVariants);

//     const imageProcessingPromises = [];

//     colorVariantsData.forEach((variant) => {
//       if (!variant.color) {
//         console.error("Color is missing for variant:", variant);
//         return res.status(400).send({
//           success: false,
//           message: "Color is missing for one of the variants.",
//         });
//       }

//       variant.images = [];
//       const matchingFiles = req.files.filter((file) =>
//         file.originalname.startsWith(variant.color)
//       );

//       if (matchingFiles.length === 0) {
//         console.warn(`No matching files for color: ${variant.color}`);
//         return res.status(400).send({
//           success: false,
//           message: `No images found for color: ${variant.color}`,
//         });
//       }

//       matchingFiles.forEach((file) => {
//         if (file.size > 5 * 1024 * 1024) {
//           // Limit file size to 5MB
//           console.warn(`File too large: ${file.originalname}`);
//           return res.status(400).send({
//             success: false,
//             message: `File ${file.originalname} exceeds the maximum size limit of 5MB.`,
//           });
//         }

//         const processImage = async (sizeName, width) => {
//           const webpFileName = `${Date.now()}-${file.originalname
//             .split(".")
//             .slice(0, -1)
//             .join(".")}-${sizeName}.webp`;
//           const webpFilePath = path.join("uploads", webpFileName);

//           try {
//             let imageBuffer;

//             if (
//               file.mimetype === "image/heic" ||
//               file.mimetype === "image/heif"
//             ) {
//               const jpegBuffer = await heicConvert({
//                 buffer: fs.readFileSync(file.path),
//                 format: "JPEG",
//               });
//               imageBuffer = jpegBuffer;
//             } else {
//               imageBuffer = fs.readFileSync(file.path);
//             }

//             // Resize the image using sharp and save as WebP
//             await sharp(imageBuffer)
//               .resize({ width })
//               .webp({ quality: 80 })
//               .toFile(webpFilePath);
//             variant.images.push({
//               url: `/images/${webpFileName}`,
//               description: "",
//             });
//             console.log(`Image processed and URL added: ${webpFileName}`);
//           } catch (err) {
//             console.error(`Error converting image: ${err.message}`);
//             // Handle error gracefully, possibly notify the user
//           }
//         };

//         // Define sizes you want to create
//         const sizes = [
//           { name: "small", width: 200 },
//           { name: "medium", width: 500 },
//           { name: "large", width: 1000 },
//         ];

//         // Process each size
//         sizes.forEach((size) => {
//           imageProcessingPromises.push(processImage(size.name, size.width));
//         });
//       });

//       variant.sizes = variant.sizes.filter((size) => size.checked);
//     });

//     await Promise.all(imageProcessingPromises); // Wait for all image processing to finish

//     console.log("Processed Color Variants Data:", colorVariantsData);

//     const newProduct = new Product({
//       name,
//       price,
//       description,
//       category,
//       colorVariants: colorVariantsData,
//     });

//     await newProduct.save();
//     res.status(201).send({ success: true, data: newProduct });
//   } catch (error) {
//     console.error(`Error adding product: ${error.message}`);
//     res.status(400).send({ success: false, message: error.message });
//   }
// };


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

export { addProduct, getProducts, removeProduct };
