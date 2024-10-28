import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import validator from "validator";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../context/slices/CartSlice";
import Swal from "sweetalert2";
import { fetchUserProfile } from "../context/slices/userSlice";

const Order = () => {
  const delivery = 10; // Delivery fee
  const navigator = useNavigate();
  // let cart = useSelector((state) => state.cart);

  const [total, setTotal] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "United Arab Emirates",
    zipCode: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "",
    zipCode: "",
    phone: "",
  });

  const cityData = [
    "abu dhabi",
    "dubai",
    "sharjah",
    "umm al qaiwain",
    "fujairah",
    "ajman",
    "ras al khaimah",
  ];
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.user);

  useEffect(() => {
    if ( localStorage.getItem("accessToken")) {
      dispatch(fetchUserProfile());
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.name.includes(" ")
          ? profile.name.split(" ")[0]
          : profile.name,
        lastName: profile.name.includes(" ") ? profile.name.split(" ")[1] : "",
        address: profile.address?.address || "",
        apartment: profile.address?.apartment || "",
        city: profile.address?.city || "",
        country: profile.address?.country || "United Arab Emirates",
        zipCode: profile.address?.zipCode || "",
        phone: profile.address?.phone || "",
      });
    }
  }, [profile]);

  const countryData = "United Arab Emirates"; // Use local countries data
  const [phonePrefix, setPhonePrefix] = useState(""); // Store the phone prefix (dial code)

  useEffect(() => {
    const fetchCart = async () => {
      const response = await axiosInstance.get("/api/users/profile");
      if (response.data.success) {
        // const items = response.data.user.cartdata;
        const cart = response.data.user.cartdata.filter(
          (item) => !(item.name === undefined)
        );
        setCartData(cart);
        let totalAmount = 0;
        cart.forEach((item) => {
          totalAmount += +item.price.toFixed(2) * +item.quantity;
        });
        setTotal(+totalAmount.toFixed(2));
      } else {
        console.log(response.data);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    Swal.fire({
      title: "Confirm Order",
      text: "You are about to place the order with Cash on Delivery.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Place Order",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "my-popup",
        confirmButton: "sweet-confirm-button", // Confirm button color
        cancelButton: "sweet-cancel-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.post("api/users/update", {
            ...formData,
            phone: formData.phone,
          });

          if (response.data.success) {
            response.data.message;
          } else {
            response.data.message;
          }
        } catch (error) {
          console.log("Error updating profile");
        }

        try {
          const response = await axiosInstance.post("/api/order/place", {
            amount: total,
            address: formData,
            items: cartData,
          });
          if (response.data.success) {
            Swal.fire({
              title: "Order Placed!",
              text: "Your order has been successfully placed!",
              icon: "success",
              showConfirmButton: false,
              customClass: {
                popup: "my-popup",
              },
              timer: 2000,
            });
            dispatch(clearCart());
            localStorage.removeItem("cart");
            navigator("/myorders");
          } else {
            localStorage.removeItem("cart");
            location.reload();
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      country: "",
      zipCode: "",
      phone: "",
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      valid = false;
    }

    // Validate country
    if (
      !formData.city ||
      !cityData.includes(formData.city.trim().toLowerCase())
    ) {
      newErrors.city = "Please provide a city in the uae";
      valid = false;
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Postal/Zip code is required";
      valid = false;
    }

    // Validate phone number
    const phoneNumber = `${phonePrefix}${formData.phone}`;
    if (
      !validator.isMobilePhone(phoneNumber, "any", {
        strictMode: false,
      }) ||
      formData.phone.length < 9
    ) {
      newErrors.phone = "Phone number is invalid";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  return (
    <div className="order row">
      <div className="delivery-information col-12 col-md-8 col-lg-6">
        <Container className="m-0  mw-100">
          <h2 className="delivery-head">Delivery Information</h2>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="input-holder">
              <div>
                <input
                  type="text"
                  id="firstName"
                  className={`main-input ${
                    formErrors.firstName ? "is-invalid" : ""
                  }`}
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {formErrors.firstName && (
                  <span className="error-message">{formErrors.firstName}</span>
                )}
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  className={`main-input ${
                    formErrors.lastName ? "is-invalid" : ""
                  }`}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {formErrors.lastName && (
                  <span className="error-message">{formErrors.lastName}</span>
                )}
              </div>
            </div>
            <div>
              <input
                autoComplete="on"
                type="text"
                id="address"
                className={`main-input ${
                  formErrors.address ? "is-invalid" : ""
                }`}
                placeholder="Street"
                value={formData.address}
                onChange={handleChange}
              />
              {formErrors.address && (
                <span className="error-message">{formErrors.address}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                id="apartment"
                className={`main-input ${
                  formErrors.apartment ? "is-invalid" : ""
                }`}
                placeholder="Apartment"
                value={formData.apartment}
                onChange={handleChange}
              />
              {formErrors.apartment && (
                <span className="error-message">{formErrors.apartment}</span>
              )}
            </div>
            <div className="input-holder flex-column flex-md-row ">
              <div className="col-12">
                <input
                  autoComplete="off"
                  type="text"
                  id="country"
                  list="countryList"
                  className={`main-input ${
                    formErrors.country ? "is-invalid" : ""
                  }`}
                  placeholder="Country"
                  value={countryData}
                  onChange={handleChange}
                />
                {formErrors.country && (
                  <span className="error-message">{formErrors.country}</span>
                )}
                <datalist id="countryList">
                  <option>{countryData}</option>
                </datalist>
              </div>
              <div className="col-12">
                <input
                  type="text"
                  id="city"
                  className={`main-input ${
                    formErrors.city ? "is-invalid" : ""
                  }`}
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  list="cityList"
                />
                {formErrors.city && (
                  <span className="error-message">{formErrors.city}</span>
                )}
                <datalist id="cityList">
                  {cityData.map((city, index) => {
                    return (
                      <option defaultValue="Abu Dhabi" key={index}>
                        {city}
                      </option>
                    );
                  })}
                </datalist>
              </div>
            </div>
            <div>
              <input
                type="text"
                id="zipCode"
                className={`main-input ${
                  formErrors.zipCode ? "is-invalid" : ""
                }`}
                placeholder="Zipcode"
                value={formData.zipCode}
                onChange={handleChange}
              />
              {formErrors.zipCode && (
                <span className="error-message">{formErrors.zipCode}</span>
              )}
            </div>
            <div>
              <input
                autoComplete="on"
                type="tel"
                id="phone"
                className={`main-input ${formErrors.phone ? "is-invalid" : ""}`}
                placeholder="phone number without the code"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    phone: e.target.value,
                  }));
                }}
              />
              {formErrors.phone && (
                <span className="error-message">{formErrors.phone}</span>
              )}
              {/* Display the selected country flag and dial code */}
              <div className="phone-prefix">🇦🇪 +971</div>
            </div>
          </form>
        </Container>
      </div>
      <div className="payment-check col-12 col-md-4 col-lg-6">
        <h2 className="payment-head">Cart Totals</h2>
        <div className="payment-subtotal">
          <span>Subtotal</span>
          <span>{total} AED</span>
        </div>
        <div className="payment-fee">
          <span>Delivery Fee</span>
          <span>{delivery} AED</span>
        </div>
        <div className="payment-total">
          <span>Total</span>
          <span>{total + delivery} AED</span>
        </div>
        <button onClick={handleSubmit} className="main-button">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Order;
