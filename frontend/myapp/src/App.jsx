import '@fortawesome/fontawesome-free/css/all.min.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AboutUs from "./components/Customer/AboutUs/AboutUs";
import { AuthProvider } from './components/Customer/AuthContext';
import BlogPage from "./components/Customer/BlogPage/BlogPage";
import Contact from './components/Customer/Contact/Contact';
import Footer from "./components/Customer/Footer/Footer";
import LoginPage from "./components/Customer/Login/LoginPage"; // Ensure the correct path
import MembershipPage from "./components/Customer/Member/MembershipPage";
import Navbarr from "./components/Customer/Navbarr/Navbarr";
import Header from "./components/HomePage/Header/Header";
import MainContent from "./components/HomePage/Maincontent/Maincontent";
function App() {
  return (
    <div>
      <AuthProvider>
      <ToastContainer autoClose={1300} />
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
        <Route
          path="/contact"
          element={
            <>
              <Navbarr />
              <Contact />
              <Footer />
            </>
          }
        />
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
