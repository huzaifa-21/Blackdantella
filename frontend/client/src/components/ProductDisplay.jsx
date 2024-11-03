// import React, { useEffect, useState } from "react";
// import { category_items } from "../assets/assets";
// import { Container } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux"; // Import Redux selector to get products from store
// import config from "../config/config";
// import LazyLoad from "react-lazyload";
// import { fetchProducts } from "../context/slices/productSlice";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import "react-lazy-load-image-component/src/effects/blur.css";

// // Function to check if the product is in stock
// export const isProductInStock = (product) => {
//   for (let variant of product.colorVariants) {
//     for (let size of variant.sizes) {
//       if (size.quantity > 0) {
//         return true;
//       }
//     }
//   }
//   return false;
// };

// const ProductDisplay = () => {
//   const [category, setCategory] = useState("all");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(12); // Default limit for products per page
//   const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
//   const navigate = useNavigate();
//   const disptach = useDispatch();
//   const { items: products, status } = useSelector((state) => state.products); // Get sorted products from Redux

//   useEffect(() => {
//     if (status === "idle") {
//       disptach(fetchProducts());
//     }
//   }, []);
//   // Filter products based on category
//   const filteredProducts =
//     category === "all"
//       ? products
//       : products.filter((product) => product.category === category);

//   // Pagination logic for filtered products
//   const paginatedProducts = filteredProducts.slice(
//     (page - 1) * limit,
//     page * limit
//   );

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   const renderPaginationBullets = () => {
//     let bullets = [];
//     for (let i = 1; i <= totalPages; i++) {
//       bullets.push(
//         <span
//           key={i}
//           className={`pagination-bullet ${i === page ? "active" : ""}`}
//           onClick={() => handlePageChange(i)}
//         >
//           {i}
//         </span>
//       );
//     }
//     return bullets;
//   };
//   if (status === "loading") {
//     return <div className="spinner"></div>;
//   }
//   return (
//     <div className="product-display">
//       <Container>
//         {/* Category filter */}
//         <div className="product-filter">
//           {category_items.map((item) => (
//             <div
//               onClick={() =>
//                 setCategory(() => (category === item.name ? "all" : item.name))
//               }
//               className={
//                 category === item.name ? "category active" : "category"
//               }
//               key={item.name}
//             >
//               <img
//                 src={item.img}
//                 width={"80px"}
//                 height={"80px"}
//                 alt="filter icon image"
//               />
//               <span>{item.name}</span>
//             </div>
//           ))}
//         </div>

//         {/* Products display */}
//         <div className="row">
//           {paginatedProducts.map((product) => (
//             <div
//               className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4"
//               key={product._id}
//             >
//               <div
//                 className="product"
//                 onClick={() => navigate(`/product/${product._id}`)}
//               >
//                 <LazyLoad />
//                 <img
//                   src={`${config.BASE_URL}${product.colorVariants[0].images[0].url}`}
//                   alt="Product Image"
//                   loading="lazy"
//                 />
//                 <LazyLoad />
//                 <span className="product-name">{product.name}</span>
//                 <span className="product-price">{product.price} AED</span>
//                 {isProductInStock(product) ? (
//                   <span className="in-stock">in stock</span>
//                 ) : (
//                   <span className="sold-out">sold out</span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination controls with bullets */}
//         <>
//           {paginatedProducts.length < 1 ? (
//             <div className="no-products">Out of {category}</div>
//           ) : (
//             <div className="pagination">
//               <button
//                 className="pagination-button"
//                 onClick={() => handlePageChange(page - 1)}
//                 disabled={page === 1}
//               >
//                 Previous
//               </button>
//               {renderPaginationBullets()}
//               <button
//                 className="pagination-button"
//                 onClick={() => handlePageChange(page + 1)}
//                 disabled={page === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       </Container>
//     </div>
//   );
// };

// export default ProductDisplay;

import React, { useEffect, useState } from "react";
import { category_items } from "../assets/assets";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import config from "../config/config";
import { fetchProducts } from "../context/slices/productSlice";
import "react-lazy-load-image-component/src/effects/blur.css";

// Function to check if the product is in stock
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
  const [limit] = useState(12); // Default limit for products per page
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products); // Get sorted products from Redux

  // Fetch products on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Calculate filtered products and total pages based on category
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  const totalPages = Math.ceil(filteredProducts.length / limit);

  // Pagination logic for filtered products
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPaginationBullets = () => {
    let bullets = [];
    for (let i = 1; i <= totalPages; i++) {
      bullets.push(
        <span
          key={i}
          className={`pagination-bullet ${i === page ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }
    return bullets;
  };

  if (status === "loading") {
    return <div className="spinner"></div>;
  }

  return (
    <div className="product-display">
      <Container>
        {/* Category filter */}
        <div className="product-filter">
          {category_items.map((item) => (
            <div
              onClick={() =>
                setCategory(() => (category === item.name ? "all" : item.name))
              }
              className={
                category === item.name ? "category active" : "category"
              }
              key={item.name}
            >
              <img
                src={item.img}
                width={"80px"}
                height={"80px"}
                alt="filter icon image"
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Products display */}
        <div className="row">
          {paginatedProducts.map((product) => (
            <div
              className="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4"
              key={product._id}
            >
              <div
                className="product"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={`${config.BASE_URL}${product.colorVariants[0].images[0].url}`}
                  alt="Product Image"
                  loading="lazy"
                />
                <span className="product-name">{product.name}</span>
                <span className="product-price">{product.price} AED</span>
                {isProductInStock(product) ? (
                  <span className="in-stock">in stock</span>
                ) : (
                  <span className="sold-out">sold out</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls with bullets */}
        <>
          {paginatedProducts.length < 1 ? (
            <div className="no-products">Coming soon</div>
          ) : (
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
        </>
      </Container>
    </div>
  );
};

export default ProductDisplay;
