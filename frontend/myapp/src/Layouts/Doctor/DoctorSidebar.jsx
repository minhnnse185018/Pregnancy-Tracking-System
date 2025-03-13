// DoctorSidebar.jsx (mẫu cơ bản)
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const DoctorSidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
      <List>
        <ListItem button component={Link} to="/doctor">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/doctor/patients">
          <ListItemText primary="Patient List" />
        </ListItem>
        <ListItem button component={Link} to="/doctor/chat">
          <ListItemText primary="Chat" />
        </ListItem>
        <ListItem button component={Link} to="/doctor/appointments">
          <ListItemText primary="Appointments" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default DoctorSidebar;