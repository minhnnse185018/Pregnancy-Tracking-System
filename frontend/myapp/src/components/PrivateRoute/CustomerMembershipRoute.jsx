import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const CustomerMembershipRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasMembership, setHasMembership] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const navigate = useNavigate();

  const checkAuthAndMembership = async () => {
    try {
      // Kiểm tra xác thực
      const token = sessionStorage.getItem("token");
      const userRole = sessionStorage.getItem("userRole");
      const userId = sessionStorage.getItem("userID");

      const isAuth = token && userRole === "1";

      if (!isAuth || !userId) {
        navigate("/customer-login");
        setIsAuthenticated(false);
        setHasMembership(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Gọi API để kiểm tra trạng thái membership
      const response = await axios.get(
        `http://localhost:5254/api/Membership/user/${userId}/active`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Membership status response:", response.data);

      // Giả sử API trả về { isActive: true/false }
      const hasValidMembership = response.data.isActive; // Điều chỉnh theo cấu trúc trả về của API

      if (hasValidMembership) {
        sessionStorage.setItem("hasMembership", "true");
        setHasMembership(true);
      } else {
        sessionStorage.setItem("hasMembership", "false");
        setHasMembership(false);
        navigate("/membership");
      }
    } catch (error) {
      console.error("Error checking membership status:", error);
      if (error.response?.status === 401) {
        // Token không hợp lệ hoặc hết hạn
        navigate("/customer-login");
      } else {
        // Xử lý các lỗi khác (ví dụ: 404, 500)
        navigate("/membership");
      }
      setIsAuthenticated(false);
      setHasMembership(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Kiểm tra khi component được mount
    checkAuthAndMembership();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị loading trong khi kiểm tra
  }

  if (isAuthenticated && hasMembership) {
    return <Outlet />;
  }

  return null;
};

export default CustomerMembershipRoute;