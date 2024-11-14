import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";
import "normalize.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import Verfiy from "./pages/Verfiy";
import Myorders from "./pages/Myorders";
import Footer from "./components/Footer";
import TermsAndCondition from "./pages/TermsAndCondition";
import Privacy from "./pages/Privacy";
import AboutUs from "./pages/AboutUs";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./context/slices/userSlice";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./utils/ScrollToTop";
import { fetchAllProducts } from "./context/slices/productSlice";
import { fetchCartItems } from "./context/slices/CartSlice";

const App = () => {
  const [loggedIn, setLogedIn] = useState(false);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    const jwt = localStorage.getItem("accessToken");
    dispatch(fetchAllProducts());
    if (jwt) {
      dispatch(fetchCartItems());
      dispatch(fetchUserProfile());
      setLogedIn(true);
      if (!profile) {
        localStorage.clear();
      }
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          backgroundColor: "#333", // Toast background color
          color: "#fff", // Text color
        }}
      />
      <ScrollToTop />
      <Navbar loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/account/login"
          element={<Login loggedIn={loggedIn} setLogedIn={setLogedIn} />}
        />
        <Route
          path="/account/register"
          element={<Signup setLogedIn={setLogedIn} />}
        />
        <Route path="/product/:id" element={<Product loggedIn={loggedIn} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order" element={<Order />} />
        <Route path="/verify" element={<Verfiy />} />
        <Route path="/myorders" element={<Myorders />} />
        <Route path="/terms" element={<TermsAndCondition />} />
        <Route path="/policy" element={<Privacy />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
