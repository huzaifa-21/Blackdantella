
import { faCartShopping, faDownLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  updateProduct,
  setSorting,
} from "../context/slices/productSlice";
import { useNavigate } from "react-router-dom";
import { selectCartLength } from "../context/slices/CartSlice";

const Sorting = () => {
  const {
    items: products,
    status,
    sortBy,
  } = useSelector((state) => state.products);
  const cartCounter = useSelector(selectCartLength);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    let sortedProducts = [...products];
    switch (sortBy) {
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
    }
    dispatch(updateProduct(sortedProducts)); // Update sorted products in the store
  }, [sortBy]);

  const handleSortChange = (event) => {
    const value = event.target.value;
    dispatch(setSorting(value)); // Dispatch sorting action
  };

  return (
    <div className="sorting">
      <Container>
        <div className="sort-by">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" onChange={handleSortChange} value={sortBy}>
            <option value="latest">Latest items</option>
            <option value="higherPrice">Higher price</option>
            <option value="lowerPrice">Lower price</option>
          </select>
          <FontAwesomeIcon icon={faDownLong} />
        </div>
        <div className="cart-holder" onClick={() => navigator("/cart")}>
          <span htmlFor="cart-icon">Cart</span>
          <FontAwesomeIcon id="cart-icon" icon={faCartShopping} />
          {cartCounter >= 1 && (
            <span className="cart-counter">{cartCounter}</span>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Sorting;
