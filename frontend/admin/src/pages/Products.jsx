import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import config from "../config/config";
import { Navigate, useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigator = useNavigate();
  function filterProduct(id) {
    const filterdProducts = products.filter((item) => !(item._id === id));
    setProducts(filterdProducts);
  }
  async function deleteProduct(id) {
    try {
      const response = await axiosInstance.post("api/products/remove", {
        id,
      });
      if (response.data.success) {
      }
    } catch (error) {}
  }

  async function getProducts() {
    try {
      const response = await axiosInstance.get("api/products/all");
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {}
  }

  useEffect(() => {
    getProducts();
  }, []);

  if (products.length < 1) {
    return <div>...loading</div>;
  }

  return (
    <div className="products">
      {products.map((product, index) => {
        return (
          <div
            className="product"
            onClick={() => navigator(`/products/${product._id}`)}
            key={index}
          >
            <img
              src={config.BASE_URL + product.colorVariants[0].images[0].url}
              alt=""
            />
            <div className="remove-name">
              <span className="product-name">{product.name}</span>
              <span
                className="remove"
                onClick={() => {
                  deleteProduct(product._id);
                  filterProduct(product._id);
                }}
              >
                Remove
              </span>
            </div>
            <div className="color-holder">
              {product.colorVariants.map((item, index) => {
                return (
                  <div className="inner-color-holder" key={index}>
                    <span
                      className="color"
                      style={{ backgroundColor: `${item.color}` }}
                    ></span>
                    <span>{item.color}</span>
                    <span className="size">
                      {item.sizes.map((size, index) => {
                        return (
                          <div className="size-container" key={index}>
                            <span className="size-name">{size.size}:</span>
                            <span className="size-quantity">
                              {size.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="price">{product.price} AED</div>
          </div>
        );
      })}
    </div>
  );
};
{
  /* <li className="color" key={index} style={{backgroundColor:`${item.color}`}}></li> */
}
export default Products;
