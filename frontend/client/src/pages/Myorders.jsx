import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

const Myorders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axiosInstance.post("/api/order/userorders");
    setData(response.data.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!data || data.length < 1) {
    return <div className="spinner"></div>;
  }
  return (
    <div className="my-orders">
      <Container>
        <h2>My orders</h2>
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <FontAwesomeIcon icon={faBoxOpen} />
              <div className="items">
                {order.items.map((item, index) => {
                  return (
                    <div key={index} className="item-box">
                      <span className="order-name">{item.name}</span>
                      <div className="quantity">
                        Quantity : {}
                        <span>{item.quantity}</span>
                      </div>
                      <div className="size">
                        Size : <span>{item.size}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="order-info">
                  <div>
                    Items : {}
                    <span>{order.items.length}</span>
                  </div>
                  <div className="amount">
                    Amount : <span>{order.amount} AED</span>
                  </div>
                  <div className="status">
                    <span className="order-bullet ">&#x25cf;</span>{" "}
                    <span>{order.status}</span>
                  </div>
                </div>
                <button onClick={fetchOrders} className="main-button">
                  Track order
                </button>
              </div>
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default Myorders;
