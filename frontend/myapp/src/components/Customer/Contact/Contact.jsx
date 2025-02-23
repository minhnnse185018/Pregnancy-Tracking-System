import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    subject: false,
    message: false,
  });

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("userID");
    if (userId) {
      setIsLoggedIn(true);
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/profile/customer/${userId}`
          );
          if (response.status === 200) {
            const { name, email, phone } = response.data;
            setFormData((prevFormData) => ({
              ...prevFormData,
              fullName: name,
              email: email,
              phone: phone,
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, []);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^(03|05|07|08|09)\d{8}$/;
    return phonePattern.test(phoneNumber);
  };

  const validateFullName = (fullName) => {
    const fullNamePattern = /^[a-zA-Z\s]+$/;
    return fullNamePattern.test(fullName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    setErrors(validationErrors);
    if (Object.values(validationErrors).some((error) => error !== "")) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/support-tickets/create",
        formData
      );
      if (response.status === 200) {
        toast.success("Send Success!");
      } else {
        toast.error("Send Failed!");
      }
    } catch (error) {
      toast.error("Send Failed!");
    }

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const validateFormData = (data) => {
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    };

    if (!validateFullName(data.fullName)) {
      newErrors.fullName = "Full name should contain only letters and spaces.";
    }
    if (!validateEmail(data.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (data.phone && !validatePhoneNumber(data.phone)) {
      newErrors.phone = "Invalid phone number.";
    }
    if (!data.subject) {
      newErrors.subject = "Subject is required.";
    }
    if (!data.message) {
      newErrors.message = "Message is required.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateFormData(formData)[name],
    }));
  };

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error !== "");
    setIsSubmitEnabled(!hasErrors);
  }, [errors]);

  return (
    <div>
      <ToastContainer autoClose={1300} />
      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">Contact Us</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-10 d-flex justify-content-center">
              <div className="wrapper w-100">
                <div className="row no-gutters">
                  <div className="col-md-8 d-flex justify-content-center">
                    <div className="contact-wrap w-100 p-md-5 p-4">
                      <form
                        method="POST"
                        id="contactForm"
                        name="contactForm"
                        className="contactForm"
                        onSubmit={handleSubmit}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="label" htmlFor="fullName">
                                Full Name
                                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                id="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                              />
                              {touched.fullName && errors.fullName && (
                                <div style={{ color: "red" }}>{errors.fullName}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="label" htmlFor="email">
                                Email Address
                                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                id="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                              />
                              {touched.email && errors.email && (
                                <div style={{ color: "red" }}>{errors.email}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="label" htmlFor="phone">
                                Phone
                                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="phone"
                                id="phone"
                                placeholder="Phone (Optional)"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                              />
                              {touched.phone && errors.phone && (
                                <div style={{ color: "red" }}>{errors.phone}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <label className="label" htmlFor="subject">
                                Subject
                                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="subject"
                                id="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                              />
                              {touched.subject && errors.subject && (
                                <div style={{ color: "red" }}>{errors.subject}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <label className="label" htmlFor="message">
                                Message
                                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                              </label>
                              <textarea
                                name="message"
                                className="form-control"
                                id="message"
                                cols="30"
                                rows="4"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                              ></textarea>
                              {touched.message && errors.message && (
                                <div style={{ color: "red" }}>{errors.message}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12 text-center">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={!isSubmitEnabled}
                            >
                              Send Message
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex align-items-stretch">
                    <div
                      className="info-wrap w-100 p-5 img"
                      style={{
                        backgroundImage: `url(images/hero-pregnancy.png)`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
