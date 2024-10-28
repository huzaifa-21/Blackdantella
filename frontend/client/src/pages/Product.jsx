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
import mustLoggedIn from "../utils/mustLoggedIn";
import { isProductInStock } from "../components/ProductDisplay";
import axiosInstance from "../utils/axiosInstance";
import { addToCart } from "../context/slices/CartSlice";
import { useDispatch } from "react-redux";

const Product = ({ loggedIn }) => {
  const { id } = useParams();
  let [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleChange = (e) => {
    setQuantity(+e.target.value);
  };
  let [color, setColor] = useState(0);
  let [currColor, setCurrColor] = useState("black");
  let [active, setActive] = useState("all");

  useEffect(() => {
    async function fetchProducts() {
      const response = await axiosInstance.get("api/products");
      setProducts(response.data.data);
    }

    fetchProducts();
  }, []);

  async function addCartData(name, id, color, size, quantity, image, price) {
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

      if (response.data.success) {
        return ("added to cart");
      } else {
        return (response.data.message);
      }
    } catch (error) {
      return ("Error adding cart", error.message);
    }
  }

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
                    {product.colorVariants[color].images.map((image, index) => {
                      return (
                        <Carousel.Item key={index}>
                          <img src={config.BASE_URL + image.url} alt="" />
                        </Carousel.Item>
                      );
                    })}
                  </Carousel>
                </div>
                <div className="info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="price-container">
                    <label htmlFor="">Price</label>
                    <span className="price">{product.price} AED</span>
                    <span className="discount"></span>
                  </div>
                  <div className="size-container">
                    <label htmlFor="size">Size </label>
                    <div>
                      <select name="" id="size" className="size main-input">
                        {product.colorVariants[color].sizes.map(
                          (size, index) => {
                            return (
                              <option
                                value={size.size}
                                disabled={size.quantity < 1}
                                key={index}
                              >
                                {size.size}
                              </option>
                            );
                          }
                        )}
                      </select>
                      <FontAwesomeIcon
                        icon={faDownLong}
                        onClick={() => {
                          setQuantity(
                            quantity > 1 ? quantity - 1 : (quantity = 1)
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="quantity-container">
                    <label htmlFor="quantity">Quantity</label>
                    <div className="number-container">
                      <input
                        type="number"
                        name=""
                        id="quantity"
                        value={quantity}
                        onChange={handleChange}
                        className="main-input"
                      />
                      <FontAwesomeIcon
                        icon={faDownLong}
                        onClick={() => {
                          setQuantity(
                            quantity > 1 ? quantity - 1 : (quantity = 1)
                          );
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faUpLong}
                        onClick={() => {
                          setQuantity(quantity + 1);
                        }}
                      />
                    </div>
                  </div>
                  <div className="color-container">
                    <label htmlFor="colors">Colors</label>
                    <ul id="colors">
                      {product.colorVariants.map((color, index) => {
                        return (
                          <li
                            key={index}
                            className={`color-${color.color} ${
                              active == color.color ? "active" : ""
                            } `}
                            style={{
                              backgroundColor: color.color,
                              outline: `1px solid ${color.color}`,
                            }}
                            onClick={(e) => {
                              setColor(index);
                              setActive(color.color);
                              setCurrColor(color.color);
                            }}
                          ></li>
                        );
                      })}
                    </ul>
                  </div>
                  <p className="description">{product.description}</p>
                  <button
                    className="add-to-cart-button main-input"
                    disabled={!inStock}
                    onClick={() => {
                      if (loggedIn) {
                        addCartData(
                          product.name,
                          id,
                          currColor,
                          document.querySelector("#size").value,
                          quantity,
                          product.colorVariants[color].images[0].url,
                          product.price
                        );
                        dispatch(
                          addToCart({
                            id,
                            color: currColor,
                            size: document.querySelector("#size").value,
                            quantity,
                          })
                        );
                      } else {
                        navigate("/account/login");
                      }
                    }}
                  >
                    Add To Cart <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                  <button disabled={!inStock} className="buy-now main-button">
                    Buy It Now
                  </button>
                </div>
              </div>
            );
          }
        })}
      </Container>
    </main>
  );
};

export default Product;
