import React, { useState } from "react";
import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";
import validator from "validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setLogedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/users/login`, formData);
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        toast.success("Logged in successfully!");
        if (response.data.user.role === "admin") {
          setLogedIn(true);
          navigate("/");
        }
      } else {
        toast.error("Failed to login: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
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
        toast.success("Logged in successfully!");
        setLogedIn(true);
        dispatch(updateProfile(response.data.user));
        navigate("/");
        location.reload();
      } else {
        toast.error("Failed to login with Google: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const validateForm = (data) => {
    const errors = {};
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

  return (
    <Container>
      <ToastContainer />
      <form className="login" onSubmit={handleSubmit} noValidate>
        <div className="logo-container">
          <img src={assets.b_logo} className="b-logo" alt="" />
          <img src={assets.letter_logo} className="letter-logo" alt="" />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`main-input ${errors.email ? "is-invalid" : ""}`}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
        <div className="input-holder">
          <input
            className={`main-input ${errors.password ? "is-invalid" : ""}`}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
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
        <input type="submit" className="main-button" value="Login" />
      </form>
    </Container>
  );
};

export default Login;
