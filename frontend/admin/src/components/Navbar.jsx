import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import {Container} from "react-bootstrap"
const Navbar = () => {
  const [userName, setUserName] = useState();
  async function getName() {
    const response = await axiosInstance.get("/api/users/profile");
    setUserName(response.data.user.name);
  }

  useEffect(() => {
    getName();
  }, []);

  return (
    <header className="navbar">
      <Container>
        <img src={assets.letter_logo} alt="" className="logo" />
        <span className="welcome">
          Welcome <h2>{userName}</h2>
        </span>
      </Container>
    </header>
  );
};

export default Navbar;
