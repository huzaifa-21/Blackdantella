import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import config from "../config/config";
import {
  fetchCartItems,
  removeFromCart,
} from "../context/slices/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

const Cart = () => {
  let total = 0;
  const { items: cart, status } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItems())
  },[])

  async function removeFromDB(id, color, size) {
    try {
      const response = await axiosInstance.post("api/cart/remove", {
        id,
        color,
        size,
      });

      if (response.data.success) {
        setCart(
          cart.filter(
            (item) =>
              !(item.id === id && item.color === color && item.size === size)
          )
        );
      }
    } catch (error) {
      return error;
    }
  }

  if (status === "loading" || !allProducts) {
    return <div className="spinner"></div>;
  }

  if ((status === "succeeded" && cart.length < 1) || !profile) {
    return (
      <>
        <Helmet>
          <title>Cart</title>
          <link rel="canonical" href="https://www.blackdantella.com/cart" />
        </Helmet>
        <div className="no-products">
          <FontAwesomeIcon icon={faCube} /> No Products added
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart</title>
        <link rel="canonical" href="https://blackdantella.com/cart" />
      </Helmet>
      <div className="cart">
        <Container>
          <div className="cart-header">
            <h3 className="cart-title">Products</h3>
            <Link className="main-button" to="/">
              Continue shopping
            </Link>
          </div>
          <div className="items-container">
            {cart.map((item, index) => {
              return (
                <div className="item-box" key={index}>
                  {allProducts.map((product, index) => {
                    if (item.id === product._id) {
                      total += product.price * item.quantity;
                      return (
                        <div key={index}>
                          <div>
                            <img src={config.BASE_URL + item.image} alt="" />
                          </div>
                          <div className="info-remove ">
                            <span className="item-name">{product.name}</span>
                            <span
                              onClick={() => {
                                removeFromDB(item.id, item.color, item.size);
                                dispatch(
                                  removeFromCart({
                                    id: item.id,
                                    color: item.color,
                                    size: item.size,
                                  })
                                );
                              }}
                              className="remove-button d-block w-100"
                            >
                              remove
                            </span>
                          </div>
                          <div className="item-info ">
                            <span className="item-size">{item.size}</span>
                            <span className="item-quantity">
                              {item.quantity}
                            </span>
                            <span className="item-price">
                              {product.price * item.quantity}AED
                            </span>
                            <span
                              style={{
                                backgroundColor: `${item.color}`,
                              }}
                              className="item-color"
                            ></span>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })}
          </div>
          {/* <span className="total">Subtotal : {total} AED</span> */}
          <Link to="/order" className="check main-button">
            Checkout
          </Link>
        </Container>
      </div>
    </>
  );
};

export default Cart;
