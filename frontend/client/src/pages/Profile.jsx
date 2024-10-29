
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../context/slices/userSlice";
import { Helmet } from "react-helmet";
const Profile = () => {
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

  const countryData = "United Arab Emirates"; // Use local countries data
  const [phonePrefix, setPhonePrefix] = useState("+971"); // Store the phone prefix (dial code)

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

  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
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


    try {
      const response = await axiosInstance.post("api/users/update", {
        ...formData,
        phone: formData.phone, // Send the full phone number including the dial code
      });

      if (response.data.success) {
        return ("Profile updated successfully");
      } else {
        return (response.data.message);
      }
    } catch (error) {
      return ("Error updating profile");
    }
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

    // Validate city
    if (
      !formData.city ||
      !cityData.includes(formData.city.trim().toLowerCase())
    ) {
      newErrors.city = "Please provide a city in the UAE";
      valid = false;
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Postal/Zip code is required";
      valid = false;
    }

    
    if (!formData.phone || formData.phone.length < 9) {
      newErrors.phone = "Phone number is invalid";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
        <link rel="canonical" href="https://blackdantella.com/profile" />
      </Helmet>
      <div className="profile mt-5">
        <div className="profile-information">
          <Container>
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
                    <span className="error-message">
                      {formErrors.firstName}
                    </span>
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
              <div className="input-holder">
                <div>
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
                    <option>United Arab Emirates</option>
                  </datalist>
                </div>
                <div>
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
                    {cityData.map((city, index) => (
                      <option key={index}>{city}</option>
                    ))}
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
                  className={`main-input ${
                    formErrors.phone ? "is-invalid" : ""
                  }`}
                  placeholder="Phone number without the code"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      phone: e.target.value,
                    }))
                  }
                />
                {formErrors.phone && (
                  <span className="error-message">{formErrors.phone}</span>
                )}
                <div className="phone-prefix">🇦🇪 {phonePrefix}</div>
              </div>
              <button
                type="submit"
                className="main-button mt-5 m-auto p-3 d-block"
              >
                Update Profile
              </button>
            </form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Profile;
