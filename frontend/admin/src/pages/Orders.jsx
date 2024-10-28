import React from "react";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import config from "../config/config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const fetchProducts = async () => {
    try {
      const resonse = await axiosInstance.get("/api/order/list");
      setOrders(resonse.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const statusHanlder = async (event, orderId) => {
    const response = await axiosInstance.post("/api/order/status", {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="orders">
      <Container>
        {orders.map((order, index) => {
          return (
            <div key={index} className="order">
              <FontAwesomeIcon icon={faBoxOpen} />
              {order.items.map((item, index) => {
                return (
                  <div key={index} className="order-item">
                    <img src={config.BASE_URL + item.image} alt="" />
                    <span className="order-name">{item.name}</span>
                    <div className="quantity">
                      Quantity : {}
                      <span>{item.quantity}</span>
                    </div>
                    <div className="size">
                      Size : <span>{item.size}</span>
                    </div>
                    <div className="color">
                      <span style={{ backgroundColor: `${item.color}` }}></span>
                    </div>
                  </div>
                );
              })}

              <div className="user-info">
                <div className="user-name">
                  {order.address.firstName} {order.address.lastName}
                </div>
                <div className="user-address">
                  {order.address.city}, {order.address.address},
                  {order.address.apartment}
                </div>
                <div className="user-address">{order.address.phone}</div>
              </div>
              <div className="order-info">
                <div>
                  Items : {}
                  <span>{order.items.length}</span>
                </div>
                <div className="amount">
                  Amount : <span>{order.amount} AED</span>
                </div>
              </div>
              <select
                onChange={(e) => statusHanlder(e, order._id)}
                value={order.status}
              >
                <option value="Order Processing ">Order Processing </option>
                <option value="Out for Devlivery">Out for Devlivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default Orders;
