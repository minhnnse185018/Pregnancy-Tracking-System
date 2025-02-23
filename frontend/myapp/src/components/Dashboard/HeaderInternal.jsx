import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  Button,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Customer/AuthContext";
import NotificationMenu from "./NotificationMenu";

// Theme thiết kế phù hợp với chủ đề Mom and Baby
const momAndBabyTheme = createTheme({
  palette: {
    primary: {
      main: "#FFC1CC", // Hồng pastel nhẹ
    },
    secondary: {
      main: "#AEEEEE", // Xanh Tiffany Blue
    },
    background: {
      default: "#FFF5EE", // Kem nhạt
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

const Header = () => {
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const navigate = useNavigate();
  const { hasToken, setHasToken } = React.useContext(AuthContext);

  const handleOpenNotificationMenu = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userRole");
    setHasToken(false);
    navigate("/");
  };

  return (
    <ThemeProvider theme={momAndBabyTheme}>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: "#FFF5EE", boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                alt="Mom and Baby Logo"
                width="50"
                height="50"
                style={{ borderRadius: "50%" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  ml: 1,
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: "#D2691E", // Nâu ấm
                }}
              >
                MOM & BABY
              </Typography>
            </Box>

            {/* Notification & Log Out */}
            {hasToken && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Open notifications">
                  <IconButton
                    onClick={handleOpenNotificationMenu}
                    sx={{ color: "#D2691E", mr: 1 }}
                  >
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={unreadCount === 0}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                {/* Menu thông báo */}
                <NotificationMenu
                  anchorEl={anchorElNotification}
                  handleClose={handleCloseNotificationMenu}
                  setUnreadCount={setUnreadCount}
                />

                <Tooltip title="Log out">
                  <Button
                    variant="contained"
                    onClick={handleLogout}
                    startIcon={<ExitToAppIcon style={{ color: "#FFC1CC" }} />}
                    sx={{
                      bgcolor: "#FFFFFF",
                      color: "#D2691E",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      textTransform: "none",
                      border: "2px solid #FFC1CC",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#FFF0F5",
                      },
                    }}
                  >
                    Log Out
                  </Button>
                </Tooltip>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
