import React from "react";
import { Container } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { assets } from "../assets/assets";
import logout from "../utils/logout";
import { selectCartLength } from "../context/slices/CartSlice";

const Navbar = ({ loggedIn }) => {
  const navigator = useNavigate();
  const cartCounter = useSelector(selectCartLength);
  return (
    <div className="navbar">
      <Container>
        <Link to="/" aria-label="go to home page">
          <img src={assets.logo} alt="" className="logo" />
        </Link>
        <div
          className="nav-links"
          onMouseLeave={(e) => e.target.classList.remove("open")}
        >
          <Link to="/" className="nav-link" aria-label="go to the home page">
            Home
          </Link>
          <Link
            to="/about"
            href="#"
            className="nav-link"
            aria-label="about us page"
          >
            About us
          </Link>
        </div>
        <div className="login-container">
          {loggedIn ? (
            <>
              <Link to="/cart" className="cart-container">
                <FontAwesomeIcon className="cart-icon" icon={faCartShopping} />
                {cartCounter >= 1 ? (
                  <span className="cart-counter">{cartCounter}</span>
                ) : null}
              </Link>
              <FontAwesomeIcon
                onClick={(e) => {
                  document
                    .querySelector(".user-option")
                    .classList.toggle("d-none");
                }}
                icon={faUser}
                className="user-icon"
              />
              <FontAwesomeIcon
                icon={faBars}
                className="bars"
                onClick={() => {
                  document.querySelector(".nav-links").classList.toggle("open");
                }}
              />
              <div
                onMouseLeave={() =>
                  document.querySelector(".user-option").classList.add("d-none")
                }
                className="user-option d-none"
              >
                <Link to="/profile" className="profile-link">
                  Profile
                </Link>
                <Link to="/myorders">My orders</Link>
                <span onClick={logout} className="logout">
                  Logout
                </span>
              </div>
            </>
          ) : (
            <>
              <span
                onClick={() => {
                  navigator("/account/login");
                }}
                className="sign-up-link"
              >
                Login
              </span>
              <FontAwesomeIcon
                icon={faBars}
                className="bars"
                onClick={() => {
                  document.querySelector(".nav-links").classList.toggle("open");
                }}
              />
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
