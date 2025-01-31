import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faDownLong,
  faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "react-bootstrap";
import config from "../config/config";
import { isProductInStock } from "../components/ProductDisplay";
import axiosInstance from "../utils/axiosInstance";
import { addToCart } from "../context/slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllProducts } from "../context/slices/productSlice";

const Product = ({ loggedIn }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State Variables
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(0); // Default to the first color
  const [currColor, setCurrColor] = useState(""); // Updated automatically later
  const [active, setActive] = useState("");
  const [selectedSize, setSelectedSize] = useState(""); // Updated automatically later
  const [maxValue, setMaxValue] = useState(1); // New state for maximum quantity

  const { allProducts: products } = useSelector((state) => state.products);

  // Initialize color and size
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, []);

  useEffect(() => {
    if (products) {
      const product = products.find((product) => product._id === id);
      if (product) {
        const firstColor = product.colorVariants?.[0]?.color;
        const firstSize = product.colorVariants?.[0]?.sizes?.[0]?.size;

        if (firstColor) {
          setCurrColor(firstColor);
          setActive(firstColor);
        }
        if (firstSize) {
          setSelectedSize(firstSize);
        }
      }
    }
  }, [products, id]);

  // Update maxValue and reset quantity when color or size changes
  useEffect(() => {
    if (products) {
      const product = products.find((product) => product._id === id);
      if (product) {
        const selectedVariant = product.colorVariants[color];
        const selectedSizeData = selectedVariant?.sizes.find(
          (size) => size.size === selectedSize
        );
        const availableQuantity = selectedSizeData?.quantity || 0;
        setMaxValue(availableQuantity);
        setQuantity(1); // Reset quantity to 1 on color or size change
      }
    }
  }, [color, selectedSize, id, products]);

  // Handle quantity input changes
  const handleChangeQuantity = (e) => {
    const inputQuantity = parseInt(e.target.value, 10);
    if (isNaN(inputQuantity)) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(Math.max(1, inputQuantity), maxValue));
  };

  // Function to add item to cart via API
  const addCartData = async (name, id, color, size, quantity, image, price) => {
    try {
      const response = await axiosInstance.post("api/cart/add", {
        name,
        id,
        color,
        size,
        quantity,
        image,
        price,
      });
console.log(`price ${price}`)
      if (response.data.success) {
        return "added to cart";
      } else {
        return response.data.message;
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      return "Error adding cart";
    }
  };

  if (!products) {
    return <div className="spinner"></div>;
  }

  return (
    <main className="project-page">
      <Container>
        {products.map((product) => {
          const inStock = isProductInStock(product);
          if (product._id === id) {
            return (
              <div className="product" key={product._id}>
                <div className="imgs">
                  <Carousel fade>
                    {product.colorVariants[color].images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img src={config.BASE_URL + image.url} alt="" />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
                <div className="info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="price-container">
                    <label htmlFor="">Price</label>
                    <span className="price">
                      {product?.discount
                        ? product.price - product.discount
                        : product.price}{" "}
                      AED
                    </span>
                    <span className="discount"></span>
                  </div>
                  <div className="size-container">
                    <label htmlFor="size">Size </label>
                    <div>
                      <select
                        name="size"
                        id="size"
                        className="size main-input"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                      >
                        {product.colorVariants[color].sizes.map(
                          (size, index) => (
                            <option
                              value={size.size}
                              disabled={size.quantity < 1}
                              key={index}
                            >
                              {size.size}
                            </option>
                          )
                        )}
                      </select>
                      <FontAwesomeIcon
                        icon={faDownLong}
                        onClick={() => {
                          setQuantity(quantity > 1 ? quantity - 1 : 1);
                        }}
                      />
                    </div>
                  </div>
                  <div className="quantity-container">
                    <label htmlFor="quantity">Quantity</label>
                    <div className="number-container">
                      <input
                        disabled={!maxValue}
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleChangeQuantity}
                        className="main-input"
                        min="1"
                        max={maxValue}
                      />
                      <FontAwesomeIcon
                        icon={faDownLong}
                        onClick={() => {
                          setQuantity(quantity > 1 ? quantity - 1 : 1);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faUpLong}
                        onClick={() => {
                          setQuantity((prevQuantity) =>
                            prevQuantity < maxValue
                              ? prevQuantity + 1
                              : maxValue || 1
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="color-container">
                    <label htmlFor="colors">Colors</label>
                    <ul id="colors">
                      {product.colorVariants.map((variant, index) => (
                        <li
                          key={index}
                          className={`color-${variant.color} ${
                            active === variant.color ? "active" : ""
                          }`}
                          style={{
                            backgroundColor: variant.color,
                            outline: `1px solid ${variant.color}`,
                          }}
                          onClick={() => {
                            setColor(index);
                            setActive(variant.color);
                            setCurrColor(variant.color);
                            const firstSize =
                              product.colorVariants[index]?.sizes?.[0]?.size;
                            if (firstSize) {
                              setSelectedSize(firstSize);
                            }
                          }}
                        ></li>
                      ))}
                    </ul>
                  </div>
                  <p className="description">{product.description}</p>
                  <button
                    className="add-to-cart-button main-input"
                    disabled={!inStock || !maxValue}
                    onClick={() => {
                      if (loggedIn) {
                        addCartData(
                          product.name,
                          id,
                          currColor,
                          selectedSize,
                          quantity,
                          product.colorVariants[color].images[0].url,
                          product.discount >=1
                            ? product.price - product?.discount
                            : product.price
                        );
                        dispatch(
                          addToCart({
                            id,
                            color: currColor,
                            size: selectedSize,
                            quantity,
                            price:
                              product.discount >= 1
                                ? product.price - product?.discount
                                : product.price,
                          })
                        );
                        toast.success("Added To Cart");
                      } else {
                        navigate("/account/login");
                      }
                    }}
                  >
                    Add To Cart <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                  <button
                    disabled={!inStock || !maxValue}
                    className="buy-now main-button"
                    onClick={() => {
                      if (loggedIn) {
                        addCartData(
                          product.name,
                          id,
                          currColor,
                          selectedSize,
                          quantity,
                          product.colorVariants[color].images[0].url,
                          product.price
                        );
                        dispatch(
                          addToCart({
                            name: product.name,
                            id,
                            color: currColor,
                            size: selectedSize,
                            quantity,
                            image: product.colorVariants[color].images[0].url,
                            price: product.price,
                          })
                        );
                        navigate("/order");
                      } else {
                        navigate("/account/login");
                      }
                    }}
                  >
                    Buy It Now
                  </button>
                </div>
              </div>
            );
          }
          return null; // Ensure to return null if product ID doesn't match
        })}
      </Container>
    </main>
  );
};

export default Product;
