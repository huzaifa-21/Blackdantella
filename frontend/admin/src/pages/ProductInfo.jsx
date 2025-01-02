import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductInfo = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const product = products.filter((product) => product._id === id).pop();

  const hanlechange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    discount: "" | 0,
    description: "",
    category: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
    discount: "",
    description: "",
    category: "",
  });


  useEffect(() => {
    async function getProducts() {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/all`
      );
      const data = response.data.data;
      setProducts(data);
    }
    getProducts();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product._id,
        name: product?.name || "",
        price: +product?.price || 0,
        description:product.description || "",
        discount: +product?.discount || 0,
        category: product?.category || "",
      });
    }
  }, [product]);

  const validateForm = () => {
    let valid = true;

    const newErrors = {
      name: "",
      price: "",
      discount: "",
      description:"",
      category: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "name is required";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const updateProduct = async () => {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/edit`,
          { ...formData, discount: +formData.discount, price: +formData.price }
        );
      };

      updateProduct();
    } catch (error) {}
  };

  if (!product) return <div>...loading</div>;

  return (
    <div className="product-info">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="input-holder">
          <label htmlFor="name">Name:</label>
          <input
            onChange={hanlechange}
            className="main-input w-50"
            type="text"
            name=""
            id="name"
            placeholder={product?.name}
            value={formData.name}
          />
          {formErrors.name && <span>{formErrors.name}</span>}
        </div>
        <div className="input-holder">
          <label htmlFor="price">Price:</label>
          <input
            onChange={hanlechange}
            className="main-input w-50"
            type="number"
            name=""
            id="price"
            placeholder={product?.price}
            value={formData.price}
          />
        </div>
        <div className="input-holder">
          <label htmlFor="discount">Discount:</label>
          <input
            onChange={hanlechange}
            className="main-input w-50"
            type="number"
            name=""
            id="discount"
            placeholder={product?.discount}
            value={formData.discount}
          />
        </div>
        <div className="input-holder">
          <label htmlFor="description">Description:</label>
          <textarea
            onChange={hanlechange}
            className="main-input w-50"
            name=""
            id="description"
            placeholder={product?.description}
            value={formData.description}
          />
        </div>
        <div className="category-holder">
          <label htmlFor="category">Category:</label>
          <select
            onChange={hanlechange}
            name=""
            id="category"
            value={formData.category}
          >
            <option value="scrunchies">scrunchies</option>
            <option value="accessories">Accessories</option>
            <option value="head-band">head-band</option>
            {/* <option value="prayer-veil">prayer-veil</option> */}
            <option value="hijabs">Hijabs</option>
            <option value="national-day">national-day</option>
            <option value="sales">sales</option>
          </select>
        </div>
        <button
          type="submit"
          className="main-button"
          onClick={(e) => {
            e.currentTarget.classList.toggle("clicked");
          }}
        >
          submit button
        </button>
      </form>
    </div>
  );
};

export default ProductInfo;
