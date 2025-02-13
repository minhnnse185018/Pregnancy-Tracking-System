import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AboutUs from "./components/Customer/AboutUs/AboutUs";
import BlogPage from "./components/Customer/BlogPage/BlogPage";
import LoginPage from "./components/Customer/Login/LoginPage"; // Ensure the correct path
import MembershipPage from "./components/Customer/Member/MembershipPage";
import Footer from "./components/HomePage/Footer";
import Header from "./components/HomePage/Header/Header";
import MainContent from "./components/HomePage/Maincontent/Maincontent";
import Navbarr from "./components/HomePage/Navbarr";
function App() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <>
              <Navbarr />
              <Header />
              <MainContent />
              <Footer />
            </>
          }
        />
        <Route
          path="/membership"
          element={
            <>
              <Navbarr />
              <MembershipPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbarr />
              <AboutUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Navbarr />
              <BlogPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
