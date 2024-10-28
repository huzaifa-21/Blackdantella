import { faCartShopping, faDownLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct } from "../context/slices/productSlice";
import { useNavigate } from "react-router-dom";
import { selectCartLength } from "../context/slices/CartSlice";

const Sorting = () => {
  const { items: products, status } = useSelector((state) => state.products);
  const cartCounter = useSelector(selectCartLength);
  const [sortby, setSort] = useState("lowerPrice");
  const [originalProducts, setOriginalProducts] = useState([]);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    // Store the original products only once when the component mounts
    if (originalProducts.length === 0) {
      setOriginalProducts(products);
    }
  }, []);
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      setOriginalProducts(products)
    }
  }, []);

  useEffect(() => {
    let sortedProducts = [...products];
    switch (sortby) {
      case "lowerPrice":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "higherPrice":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "remove":
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }
    dispatch(updateProduct(sortedProducts));
  }, [sortby]);

  return (
    <div className="sorting">
      <Container>
        <div className="sort-by">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            onChange={(e) => setSort(e.target.value)}
            value={sortby}
          >
            <option value="latest">Latest items</option>
            <option value="higherPrice">Higher price</option>
            <option value="lowerPrice">Lower price</option>
            <option value="remove">No filter</option>
          </select>
          <FontAwesomeIcon icon={faDownLong} />
        </div>
        <div
          className="cart-holder"
          onClick={() => {
            navigator("/cart");
          }}
        >
          <span htmlFor="cart-icon">Cart</span>
          <FontAwesomeIcon id="cart-icon" icon={faCartShopping} />
          {cartCounter >= 1 ? (
            <span className="cart-counter">{cartCounter}</span>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default Sorting;
