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
  },[products])

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
    if (totalPages < 1) return null; // Don't render pagination if only one page

    return Array.from({ length: totalPages }, (_, i) => (
      <span
        key={i + 1}
        className={`pagination-bullet ${i + 1 === page ? "active" : ""}`}
        onClick={() => handlePageChange(i + 1)}
      >
        {i + 1}
      </span>
    ));
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
            {products.map((product) => (
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
                    loading="lazy"
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
