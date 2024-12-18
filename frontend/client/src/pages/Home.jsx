import React, { useEffect, useState } from "react";
import Sorting from "../components/Sorting";
import ProductDisplay from "../components/ProductDisplay";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "../context/slices/CartSlice";
import { Helmet } from "react-helmet";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const jwt = localStorage.getItem("accessToken");
    if (jwt) {
      // setLogedIn(true);
      dispatch(fetchCartItems());
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Blackdantella</title>
        <link rel="canonical" href="https://www.blackdantella.com/" />
      </Helmet>
      <div className="home" aria-label="homepage">
        <h1 className="welcome-heading">Handmade Store</h1>
        <Sorting />
        <ProductDisplay />
      </div>
    </>
  );
};

export default Home;
