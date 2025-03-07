import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AboutUs from "./components/Customer/AboutUs/AboutUs";
import { AuthProvider } from "./components/Customer/AuthContext";
import BlogPage from "./components/Customer/BlogPage/BlogPage";
import BookAppointment from "./components/Customer/BookAppointment/BookAppointment";
import Contact from "./components/Customer/Contact/Contact";
import UserProfile from "./components/Customer/CustomerProfile/CustomerProfile";
import FetalGrowthTracker from "./components/Customer/FetalGrowthTracker/FetalGrowthTracker";
import Footer from "./components/Customer/Footer/Footer";
import Header from "./components/Customer/Header/Header";
import InternalLoginPage from "./components/Customer/Login/InternalLoginPage";
import LoginPage from "./components/Customer/Login/LoginPage";
import MembershipPage from "./components/Customer/Member/MembershipPage";
import Navbarr from "./components/Customer/Navbarr/Navbarr";
import PaymentFailure from "./components/Dashboard/PaymentFailure";
import PaymentSuccess from "./components/Dashboard/PaymentSuccess";
import HealthTipComponent from "./components/HealthTipComponent/HealthTipComponent";
import MainContent from "./components/HomePage/Maincontent/Maincontent";
import AdminPrivateRoute from "./components/PrivateRoute/AdminPrivateRoute";
import CustomerPrivateRoute from "./components/PrivateRoute/CustomerPrivateRoute";
import ManagerPrivateRoute from "./components/PrivateRoute/ManagerPrivateRoute";
import AdminLayout from "./Layouts/Admin/AdminLayout";
import ManagerLayout from "./Layouts/Manager/ManagerLayout";
import AdminSalon from "./Pages/Admin/AdminBlog";
import AdminPersonnel from "./Pages/Admin/AdminPersonnel";
import AdminProfilePage from "./Pages/Admin/AdminProfilePage";
import ManageCustomer from "./Pages/Admin/ManagerCustomer";
import ManagerAppointments from "./Pages/Manager/ManagerAppointments";
import ManagerBlogs from "./Pages/Manager/ManagerBlogs";
import ManagerPayroll from "./Pages/Manager/ManagerPayroll";
import ManagerPersonnel from "./Pages/Manager/ManagerPersonnel";
import ManagerProfilePage from "./Pages/Manager/ManagerProfilePage";
import ManageRevenuePage from "./Pages/Manager/ManagerRevenuePage";
import ManagerSchedule from "./Pages/Manager/ManagerSchedule";
import ManagerServices from "./Pages/Manager/ManagerServices";
import ManagerTransaction from "./Pages/Manager/ManagerTransaction";

function App() {
  return (
    <div>
      <AuthProvider>
        <ToastContainer autoClose={1300} />
        <Routes>
          <Route path="/customer-login" element={<LoginPage />} />
          <Route path="/internal-login" element={<InternalLoginPage />} />

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
            path="/appointment"
            element={
              <>
                <Navbarr />
                <BookAppointment />
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
            path="/payment-success"
            element={
              <>
                <Navbarr />
                <PaymentSuccess />
                <Footer />
              </>
            }
          />
          <Route
            path="/payment-failure"
            element={
              <>
                <Navbarr />
                <PaymentFailure />
                <Footer />
              </>
            }
          />
          <Route
            path="/growth-tracker"
            element={
              <>
                <Navbarr />
                <FetalGrowthTracker />
                <Footer />
              </>
            }
          />
          <Route
            path="/health-tips"
            element={
              <>
                <Navbarr />
                <HealthTipComponent />
                <Footer />
              </>
            }
          />

          {/* Protected Routes */}
          <Route path="/profile" element={<CustomerPrivateRoute />}>
            <Route
              path=""
              element={
                <>
                  <Navbarr />
                  <UserProfile />
                  <Footer />
                </>
              }
            />
          </Route>
          {/* DASHBOARD ADMIN */}
          <Route path="/admin" element={<AdminPrivateRoute />}>
            <Route path="" element={<AdminLayout />}>
              <Route path="admin-profile" element={<AdminProfilePage />} />
              <Route path="admin-personnel" element={<AdminPersonnel />} />
              <Route path="admin-salon" element={<AdminSalon />} />
              <Route path="admin-customer" element={<ManageCustomer />} />
            </Route>
          </Route>
          {/* DASHBOARD MANAGER */}
          <Route path="/manager" element={<ManagerPrivateRoute />}>
            <Route path="" element={<ManagerLayout />}>
              <Route path="manager-services" element={<ManagerServices />} />
              <Route path="manager-profile" element={<ManagerProfilePage />} />
              <Route path="manager-personnel" element={<ManagerPersonnel />} />
              <Route path="manager-revenue" element={<ManageRevenuePage />} />
              <Route path="manager-payroll" element={<ManagerPayroll />} />
              <Route
                path="manager-transaction"
                element={<ManagerTransaction />}
              />
              <Route path="manager-blog" element={<ManagerBlogs />} />
              <Route
                path="view-appointments"
                element={<ManagerAppointments />}
              />
              <Route path="manager-schedule" element={<ManagerSchedule />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
