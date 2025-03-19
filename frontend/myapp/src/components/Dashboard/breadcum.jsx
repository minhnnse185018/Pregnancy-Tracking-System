import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const BreadcrumbsHeader = () => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div
      role="presentation"
      style={{
        padding: "10px 20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "green" }} />
        } // Màu cho icon phân cách
        aria-label="breadcrumb"
        sx={{ fontSize: "1.2rem", fontWeight: "bold" }} // Tăng kích thước và đậm cho breadcrumbs
      >
        <Link
          component={RouterLink}
          underline="hover"
          color="success"
          to="/"
          sx={{
            "&:hover": { color: "#1e88e5", textDecoration: "underline" }, // Thay đổi màu khi hover
            fontSize: "1.2rem",
          }}
        >
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Typography
              color="text.primary"
              key={to}
              sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#424242" }} // Kiểu cho breadcrumb cuối cùng
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              underline="hover"
              to={to}
              key={to}
              sx={{
                "&:hover": { color: "#1e8e5", textDecoration: "underline" }, // Kiểu cho các đường link
                fontSize: "1.2rem",
              }}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsHeader;
