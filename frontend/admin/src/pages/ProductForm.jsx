import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";
const ProductForm = ({ setLogedIn }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    colorVariants: [],
  });

  const [currentColor, setCurrentColor] = useState({
    color: "",
    images: [],
    sizes: [
      { size: "S", quantity: 1, checked: true },
      { size: "M", quantity: 1, checked: true },
      { size: "L", quantity: 1, checked: true },
      { size: "XL", quantity: 1, checked: true },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setCurrentColor({ ...currentColor, [name]: value });
  };

  const handleSizeChange = (index) => (e) => {
    const { name, value, checked } = e.target;
    const updatedSizes = currentColor.sizes.map((size, i) =>
      i === index
        ? { ...size, [name]: name === "checked" ? checked : value }
        : size
    );
    setCurrentColor({ ...currentColor, sizes: updatedSizes });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCurrentColor({ ...currentColor, images: files });
  };

  const addColorVariant = () => {
    setProduct({
      ...product,
      colorVariants: [...product.colorVariants, currentColor],
    });
    setCurrentColor({
      color: "",
      images: [],
      sizes: [
        { size: "S", quantity: 0, checked: false },
        { size: "M", quantity: 0, checked: false },
        { size: "L", quantity: 0, checked: false },
        { size: "XL", quantity: 0, checked: false },
      ],
    });
  };

  const checkAdmin = async () => {
    const response = await axiosInstance.get("/api/users/profile");
    console.log(response.data.user.role);
    if (response.data.user.role == "admin") {
      setLogedIn(true);
    } else {
      setLogedIn(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category || "scrunches");
    formData.append("colorVariants", JSON.stringify(product.colorVariants));

    product.colorVariants.forEach((variant) => {
      variant.images.forEach((image, index) => {
        formData.append(
          "images",
          image,
          `${variant.color}-${index}-${image.name}`
        );
      });
    });

    try {
      const response = await axiosInstance.post("api/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts([...products, response.data.data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-product">
      <Container>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name"> Name</label>
            <input
              placeholder="Black scarve"
              type="text"
              name="name"
              id="name"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              placeholder="40"
              type="number"
              name="price"
              id="price"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              placeholder="Black scarve made of..."
              name="description"
              id="description"
              value={product.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <div>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
              >
                <option value="scrunches">Scrunches</option>
                <option value="accessories">Accessories</option>
                <option value="bandas">Bandas</option>
                <option value="prayer-suite">Prayer Suite</option>
                <option value="hijabs">Hijabs</option>
              </select>
              <FontAwesomeIcon icon={faArrowDownLong} />
            </div>
          </div>
          <div className="image-color-holder">
            {/* <h3>Add Color Variant</h3> */}
            <div>
              <label htmlFor="colorName">Color Name:</label>
              <input
                placeholder="#0000ff OR red"
                id="colorName"
                type="text"
                name="color"
                value={currentColor.color}
                onChange={handleColorChange}
              />
            </div>
            <div className="image-holder">
              <label htmlFor="images">Images:</label>
              <input
                id="images"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.heic"
                onChange={handleImageChange}
                required
              />
              <div className="inner-images m-auto">
                {currentColor.images.length > 0 &&
                  currentColor.images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`color variant ${index}`}
                      style={{ width: "80px", height: "80px" }}
                    />
                  ))}
              </div>
            </div>
            <div className="sizes row">
              {currentColor.sizes.map((size, index) => (
                <div key={index} className="col-md-6 col-xl-3 gap-3 mb-3">
                  <input
                    id={size.size}
                    type="checkbox"
                    name="checked"
                    checked={size.checked}
                    onChange={handleSizeChange(index)}
                  />
                  <label htmlFor={size.size}>{size.size}</label>
                  {size.checked && (
                    <input
                      type="number"
                      name="quantity"
                      value={size.quantity}
                      onChange={handleSizeChange(index)}
                      placeholder="Quantity"
                    />
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addColorVariant}>
              Add Color Variant
            </button>
          </div>
          <button type="submit">Submit Product</button>
        </form>
      </Container>
      <button
        onClick={() =>
          setProduct({
            name: "",
            price: "",
            description: "",
            category: "",
            colorVariants: [],
          })
        }
      >
        Add New Product
      </button>
    </div>
  );
};

export default ProductForm;
