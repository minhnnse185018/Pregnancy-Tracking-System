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

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                alt="logo"
                width="50"
                height="50"
                style={{ filter: "invert(1)" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  ml: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "white",
                }}
              >
                LEOPARD
              </Typography>
            </Box>

            {/* Notification & Log Out */}
            {hasToken && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Open notifications">
                  <IconButton
                    onClick={handleOpenNotificationMenu}
                    sx={{ color: "white", mr: 1 }}
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
                    startIcon={<ExitToAppIcon style={{ color: "#4CAF50" }} />}
                    sx={{
                      bgcolor: "white",
                      color: "#4CAF50",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      border: "1px solid #4CAF50",
                      "&:hover": {
                        bgcolor: "#f0f0f0",
                      },
                      "&:active": {
                        bgcolor: "#e0e0e0",
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
