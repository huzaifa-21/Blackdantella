import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { assets } from "../assets/assets";
import axios from "axios";
import validator from "validator";
import config from "../config/config";
import { auth, googleProvider } from "../config/firebaseConfig"; // Import Firebase Auth
import { signInWithPopup } from "firebase/auth";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "../context/slices/userSlice";
import { Helmet } from "react-helmet";

const Signup = ({ setLogedIn }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/users/register`,
        formData
      );
      if (response.data.success) {
        const responsee = await axiosInstance.post(`/api/users/login`, formData);
        if (responsee.data.success) {
          localStorage.setItem("accessToken", responsee.data.accessToken);
          setLogedIn(true);
          dispatch(updateProfile(responsee.data.user));
          navigate("/");
        } else {
          return ("Failed to login: " + responsee.data.message);
        }
      } else {
        return ("Failed to register user: " + responsee.data.message);
      }
    } catch (error) {
      return ("Error: " + error.message);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Name is required";
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (
      !validator.isStrongPassword(data.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      errors.password =
        "Password must be 8 or more characters with a mix of letters, numbers, and symbols";
    }
    return errors;
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const tokenId = result.user.accessToken;

      // Send the token to the backend for verification and user creation
      const response = await axiosInstance.post("/api/users/google-login", {
        tokenId,
      });

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setLogedIn(true);
        dispatch(updateProfile(response.data.user));
        navigate("/");
      } else {
        return ("Failed to login with Google: " + response.data.message);
      }
    } catch (error) {
      return ("Error: " + error.message);
    }
  };
  return (
    <>
      <Helmet>
        <title>Sign up</title>
        <link
          rel="canonical"
          href="https://www.blackdantella.com/account/register"
        />
      </Helmet>
      <Container>
        <form className="sign-up" onSubmit={handleSubmit} noValidate>
          <h3 className="sign-intro">Create an account</h3>
          <p className="have-account-p">
            Already have an account? <Link to="/account/login">Login</Link>
          </p>
          <div className="input-holder">
            <label htmlFor="name">What should we call you?</label>
            <input
              type="text"
              className={`main-input ${errors.name ? "is-invalid" : ""}`}
              name="name"
              id="name"
              placeholder="Enter your profile name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className="input-holder">
            <label htmlFor="email">What's your email?</label>
            <input
              type="email"
              className={`main-input ${errors.email ? "is-invalid" : ""}`}
              name="email"
              id="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
          <div className="input-holder">
            <label htmlFor="password">Create a password</label>
            <input
              className={`main-input ${errors.password ? "is-invalid" : ""}`}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={() => setShowPassword(!showPassword)}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>
          <p className="terms">
            By creating an account, you agree to the{" "}
            <Link to="/terms" className="terms-link">
              Terms of use
            </Link>{" "}
            and{" "}
            <Link to="/policy" className="privacy-link">
              Privacy Policy.
            </Link>
          </p>
          <input type="submit" value="Create account" className="main-button" />
          <p className="or">OR Continue With</p>
          <div className="social-container">
            <div className="social-login" onClick={handleGoogleLogin}>
              <img src={assets.google_logo} alt="" />
              Continue With Google
            </div>
            <div className="social-login">
              <img src={assets.apple_logo} alt="" />
              Continue With Apple
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default Signup;
