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

function App() {
  const [loggedIn, setLogedIn] = useState(false);
  const checkAdmin = async () => {
    const response = await axiosInstance.get("/api/users/profile");
    console.log(response.data.user.role);
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
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <div className="home">
          <Routes>
            <Route path="/" element={<ProductForm setLogedIn={setLogedIn} />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
