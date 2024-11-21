import React, { useEffect, useState } from "react";
import { category_items } from "../assets/assets";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import config from "../config/config";
import { fetchProducts } from "../context/slices/productSlice";

export const isProductInStock = (product) => {
  for (let variant of product.colorVariants) {
    for (let size of variant.sizes) {
      if (size.quantity > 0) {
        return true;
      }
    }
  }
  return false;
};

const ProductDisplay = () => {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get product data and total from Redux
  const {
    items: products,
    total,
    status,
  } = useSelector((state) => state.products);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [products]);

  // Calculate totalPages based on total and limit
  const totalPages = Math.ceil(total / limit) || 1;

  // Fetch products based on page, category, and limit
  useEffect(() => {
    dispatch(fetchProducts({ page, limit, category }));
  }, [page, category, limit, dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1); // Reset to page 1 when category changes
  };

  const renderPaginationBullets = () => {
    if (totalPages < 1) return null;

    const pages = [];
    const maxStartPages = 1; // Number of pages to show at the start
    const maxEndPages = 1; // Number of pages to show at the end

    // Show all pages without ellipses if totalPages is 3 or less
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <span
            key={i}
            className={`pagination-bullet ${page === i ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </span>
        );
      }
      return pages;
    }

    // Show the first page
    pages.push(
      <span
        key={1}
        className={`pagination-bullet ${page === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </span>
    );

    // Show ellipses if the current page is beyond the first few pages
    if (page > 3) {
      pages.push(
        <span key="start-ellipsis" className="pagination-ellipsis">
          ...
        </span>
      );
    }

    // Show up to two pages around the current page
    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <span
          key={i}
          className={`pagination-bullet ${page === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }

    // Show ellipses if there are pages between the current range and the last page
    if (page < totalPages - 2) {
      pages.push(
        <span key="end-ellipsis" className="pagination-ellipsis">
          ...
        </span>
      );
    }

    // Show the last page
    pages.push(
      <span
        key={totalPages}
        className={`pagination-bullet ${page === totalPages ? "active" : ""}`}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </span>
    );

    return pages;
  };

  return (
    <div className="product-display">
      <Container>
        <div className="product-filter">
          {category_items.map((item) => (
            <div
              onClick={() =>
                handleCategoryChange(category === item.name ? "all" : item.name)
              }
              className={
                category === item.name ? "category active" : "category"
              }
              key={item.name}
            >
              <img src={item.img} width={80} height={80} alt={item.name} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        {status !== "succeeded" ? (
          <div className="spinner"></div>
        ) : !products || products.length < 1 ? (
          <div className="no-products">Coming soon</div>
        ) : (
          <div className="row">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
                <div
                  className="product"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={`${config.BASE_URL}${product.colorVariants[0].images[0].url}`}
                    alt={`${product.category}-image`}
                    loading={index > 3 ? "lazy" : "none"}
                    width={100}
                    height={300}
                  />
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">{product.price} AED</span>
                  {isProductInStock(product) ? (
                    <span className="in-stock">In stock</span>
                  ) : (
                    <span className="sold-out">Sold out</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length < 1 ? null : (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            {renderPaginationBullets()}
            <button
              className="pagination-button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductDisplay;
