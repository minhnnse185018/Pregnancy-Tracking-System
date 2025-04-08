import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AboutUs from "./components/Customer/AboutUs/AboutUs";
import { AuthProvider } from "./components/Customer/AuthContext";
import BlogDetailsPage from "./components/Customer/BlogPage/BlogDetailsPage";
import BlogPage from "./components/Customer/BlogPage/BlogPage";
import BookAppointment from "./components/Customer/BookAppointment/BookAppointment";
import MedicalAppointments from "./components/Customer/BookAppointment/viewAppointment";
import Contact from "./components/Customer/Contact/Contact";
import UserProfile from "./components/Customer/CustomerProfile/CustomerProfile";
import FetalGrowthTracker from "./components/Customer/FetalGrowthTracker/FetalGrowthTracker";
import Footer from "./components/Customer/Footer/Footer";
import ForgotPasswordPage from "./components/Customer/Login/forgotPassword";
import InternalLoginPage from "./components/Customer/Login/InternalLoginPage";
import LoginPage from "./components/Customer/Login/LoginPage";
import RegisterAccount from "./components/Customer/Login/RegisterAccout";
import ResetPasswordPage from "./components/Customer/Login/resetPassword";
import MembershipPage from "./components/Customer/Member/MembershipPage";
import PaymentReturnHandler from "./components/Customer/Member/PaymentReturnHandler";
import Navbarr from "./components/Customer/Navbarr/Navbarr";
import CreatePregnancyProfile from "./components/Customer/PregnancyProfile/CreatePregnancyProfile";
import PregnancyProfile from "./components/Customer/PregnancyProfile/PregnancyProfile";
import UserGrowthAlert from "./components/Customer/UserGrowthAlert/UserGrowthAlert";
import PaymentFailure from "./components/Dashboard/PaymentFailure";
import PaymentSuccess from "./components/Dashboard/PaymentSuccess";
import HealthTipComponent from "./components/HealthTipComponent/HealthTipComponent";
import MainContent from "./components/HomePage/Maincontent/Maincontent";
import AdminPrivateRoute from "./components/PrivateRoute/AdminPrivateRoute";
import CustomerMembershipRoute from "./components/PrivateRoute/CustomerMembershipRoute";
import CustomerPrivateRoute from "./components/PrivateRoute/CustomerPrivateRoute";
import DoctorPrivateRoute from "./components/PrivateRoute/DoctorPrivateRoute";
import ManagerPrivateRoute from "./components/PrivateRoute/ManagerPrivateRoute";
import AdminLayout from "./Layouts/Admin/AdminLayout";
import DoctorLayout from "./Layouts/Doctor/DoctorLayout";
import ManagerLayout from "./Layouts/Manager/ManagerLayout";
import AdminMemberPlan from "./Pages/Admin/AdminMemberPlan";
import AdminProfilePage from "./Pages/Admin/AdminProfilePage";
import ManageCustomer from "./Pages/Admin/ManagerCustomer";
import DoctorChat from "./Pages/Doctor/DoctorChat";
import DoctorGrowthAlert from "./Pages/Doctor/DoctorGrowthAlert";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";
import ManagerBlogs from "./Pages/Manager/ManagerBlogs";
import ManagerFAQs from "./Pages/Manager/ManagerFAQs";
import ManagerFetalStandard from "./Pages/Manager/ManagerFetalStandard";
import ManagerProfilePage from "./Pages/Manager/ManagerProfilePage";
import ManagerReminders from "./Pages/Manager/ManagerReminders";
import ManageRevenuePage from "./Pages/Manager/ManagerRevenuePage";
import ManagerSchedule from "./Pages/Manager/ManagerSchedule";
import ManagerServices from "./Pages/Manager/ManagerServices";
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
          <Route path="/appointment" element={<CustomerPrivateRoute />}>
            <Route
              path=""
              element={
                <>
                  <CustomerMembershipRoute />
                  <Navbarr />
                  <BookAppointment />
                  <Footer />
                </>
              }
            />
          </Route>
          <Route path="/blog" element={<CustomerPrivateRoute />}>
            <Route
              path=""
              element={
                <>
                  <CustomerMembershipRoute />
                  <Navbarr />
                  <BlogPage />
                  <Footer />
                </>
              }
            />
          </Route>
          <Route
            path="/blog/:id"
            element={
              <>
                <Navbarr />
                <BlogDetailsPage />
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
          <Route path="/membership" element={<CustomerPrivateRoute />}>
            <Route
              path=""
              element={
                <>
                  <Navbarr />
                  <MembershipPage />
                  <Footer />
                </>
              }
            />
          </Route>
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
          <Route path="/growth-tracker">
            <Route
              path=""
              element={
                <>
                  <CustomerMembershipRoute/>
                  <Navbarr />
                  <FetalGrowthTracker />
                  <Footer />
                </>
              }
            />
          </Route>

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
          {/* Customer Routes */}
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
          <Route path="/profilePregnancy" element={<CustomerPrivateRoute />}>
            <Route
              path=""
              element={
                <>
                  <Navbarr />
                  <PregnancyProfile />
                  <Footer />
                </>
              }
            />
          </Route>
          <Route
            path="/create-pregnancy-profile"
            element={<CustomerPrivateRoute />}
          >
            <Route
              path=""
              element={
                <>
                  <Navbarr />
                  <CreatePregnancyProfile />
                  <Footer />
                </>
              }
            />
          </Route>
          <Route path="/userAlert" element={<CustomerPrivateRoute />}>
            <Route
              path=""
              element={
                <>
                  <Navbarr />
                  <UserGrowthAlert />
                  <Footer />
                </>
              }
            />
          </Route>
          <Route
            path="/forgotPassword"
            element={
              <>
                <Navbarr />
                <ForgotPasswordPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/reset-password"
            element={
              <>
                <ResetPasswordPage />
              </>
            }
          />
          <Route
            path="/return"
            element={
              <>
                <PaymentReturnHandler />/
              </>
            }
          />

          <Route
            path="/viewAppointment"
            element={
              <>
                <Navbarr />
                <MedicalAppointments />/
                <Footer />
              </>
            }
          />
          <Route
            path="/verify-account"
            element={
              <>
                <RegisterAccount />/
              </>
            }
          />

          {/* DASHBOARD ADMIN */}
          <Route path="/admin" element={<AdminPrivateRoute />}>
            <Route path="" element={<AdminLayout />}>
              <Route path="admin-profile" element={<AdminProfilePage />} />
              <Route path="admin-customer" element={<ManageCustomer />} />
              <Route path="admin-memberplan" element={<AdminMemberPlan />} />
            </Route>
          </Route>
          {/* DASHBOARD DOCTOR */}
          <Route path="/doctor" element={<DoctorPrivateRoute />}>
            <Route path="" element={<DoctorLayout />}>
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              <Route path="/doctor/chat" element={<DoctorChat />} />
              <Route path="/doctor/alert" element={<DoctorGrowthAlert />} />
            </Route>
          </Route>
          {/* DASHBOARD MANAGER */}
          <Route path="/manager" element={<ManagerPrivateRoute />}>
            <Route path="" element={<ManagerLayout />}>
              <Route path="manager-services" element={<ManagerServices />} />
              <Route path="manager-profile" element={<ManagerProfilePage />} />
              <Route path="manager-faq" element={<ManagerFAQs />} />
              <Route path="manager-revenue" element={<ManageRevenuePage />} />
              <Route path="manager-reminders" element={<ManagerReminders />} />
              <Route path="manager-blog" element={<ManagerBlogs />} />
              <Route
                path="manager-fetalstandard"
                element={<ManagerFetalStandard />}
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
