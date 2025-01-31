import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ProductForm from "./pages/ProductForm";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import axiosInstance from "./utils/axiosInstance";
import { ToastContainer } from "react-toastify";
import ProductInfo from "./pages/ProductInfo";
import Users from "./pages/Users";

function App() {
  const [loggedIn, setLogedIn] = useState(false);
  const checkAdmin = async () => {
    const response = await axiosInstance.get("/api/users/profile");
    if (response.data.user.role == "admin") {
      setLogedIn(true);
    } else {
      setLogedIn(false);
    }
  };
  useEffect(() => {
    checkAdmin();
  }, []);

  if (!loggedIn) {
    return <Login setLogedIn={setLogedIn} />;
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <div className="home">
          <Routes>
            <Route path="/" element={<ProductForm setLogedIn={setLogedIn} />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductInfo />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
