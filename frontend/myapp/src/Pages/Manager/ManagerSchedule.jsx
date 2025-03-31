// API
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Checkbox,
  TextField,
  TableSortLabel,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { Delete } from "@mui/icons-material";

// Thay thế bằng URL thực tế

export default function ManagerSchedule() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [stylistData, setStylistData] = useState([]);
  const [selectedStylists, setSelectedStylists] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [originalScheduleData, setOriginalScheduleData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [addOpen, setAddOpen] = useState(false); // Kiểm soát trạng thái mở modal
  // Function to format date to "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const accountID = sessionStorage.getItem("userID");
  // Lấy danh sách stylist từ API theo ngày được chọn
  const fetchStylists = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/schedule/view/stylist/${accountID}`
      );
      console.log("🚀 ~ response:", response);
      setStylistData(response.data);
    } catch (error) {
      console.error("Error fetching stylists:", error);
    }
  };

  // Lấy lịch làm việc từ API để lọc
  // ----------------------------------------------------------
  const fetchSchedules = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/schedule/view/${accountID}/${date}`
      );
      setScheduleData(response.data);
      setOriginalScheduleData(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };
  const handleDeleteSchedule = async (stylistName, date) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        // Mã hóa stylistName và date để đảm bảo an toàn cho URL
        const encodedStylistName = encodeURIComponent(stylistName);
        const encodedDate = encodeURIComponent(date);

        // Gọi API xóa lịch làm việc dựa trên stylistName và date
        await axios.delete(
          `http://localhost:8080/schedule/delete/${encodedStylistName}/${encodedDate}`
        );

        alert("Schedule deleted successfully.");
        fetchSchedules(date); // Cập nhật lại lịch sau khi xóa
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };
  const handleAddSchedule = () => {
    fetchStylists();
    setAddOpen(true);
  };
  // -------------------------------------------------------------------
  // Khi người dùng chọn ngày từ bộ chọn, gọi API để lấy danh sách stylist

  // Lọc lịch làm việc theo ngày
  const handleFilterByDate = (date) => {
    setFilterDate(date);
    if (date) {
      fetchSchedules(formatDate(date)); // Gọi API để lấy lịch làm việc cho ngày được lọc
    } else {
      setScheduleData(originalScheduleData);
    }
  };

  // Cập nhật stylist đã chọn trong modal
  const handleSelectStylist = (stylistName) => {
    if (selectedStylists.includes(stylistName)) {
      // Nếu stylist đã được chọn, loại bỏ khỏi danh sách
      setSelectedStylists(
        selectedStylists.filter((name) => name !== stylistName)
      );
    } else {
      // Nếu stylist chưa được chọn, thêm vào danh sách
      setSelectedStylists([...selectedStylists, stylistName]);
    }
  };

  // Lưu stylist đã chọn vào backend
  const handleSaveStylists = async () => {
    const stylistIds = selectedStylists.map((stylistName) => {
      const stylist = stylistData.find(
        (sty) => sty.stylistName === stylistName
      );
      console.log(stylist);

      return stylist?.stylistId;
    });

    const requestBody = {
      date: formatDate(selectedDate),
      stylistIds: stylistIds,
    };

    try {
      await axios.post(`http://localhost:8080/schedule/add`, requestBody);
      alert("Schedule saved successfully.");
      handleClose();
      fetchSchedules(formatDate(selectedDate)); // Cập nhật lịch sau khi lưu
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  // Mở modal chỉnh sửa stylist cho ngày cụ thể
  const handleEditSchedule = (date) => {
    setEditDate(date);
    const stylistsForDate = originalScheduleData
      .filter((item) => item.date === date)
      .map((item) => item.stylistName);
    setSelectedStylists(stylistsForDate);
    fetchStylists(date); // Gọi API để lấy stylist theo ngày
    setEditOpen(true);
  };

  // Lưu stylist đã chỉnh sửa vào backend
  // const handleSaveEditedStylists = async () => {
  //     const stylistIds = selectedStylists.map((stylistName) => {
  //         const stylist = stylistData.find((sty) => sty.name === stylistName);
  //         return stylist?.id;
  //     });

  //     const requestBody = {
  //         date: editDate,
  //         stylistIds,
  //     };

  //     try {
  //         await axios.post(`${API_BASE_URL}/schedules`, requestBody);
  //         alert("Schedule updated successfully.");
  //         handleClose();
  //         fetchSchedules(editDate); // Cập nhật lịch sau khi chỉnh sửa
  //     } catch (error) {
  //         console.error("Error updating schedule:", error);
  //     }
  // };

  // Đóng modal
  const handleClose = () => {
    setAddOpen(false);
    setEditOpen(false);
    setSelectedStylists([]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center", color: "#4CAF50" }}
        >
          Manager Schedule
        </Typography>

        {/* Bộ chọn ngày để thêm hoặc lọc schedule */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <DatePicker
            label="Filter by Date"
            value={filterDate}
            onChange={(newValue) => handleFilterByDate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 200 }}
              />
            )}
          />
        </Box>

        {/* Bảng lịch làm việc */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#4CAF50" }}>
                <TableCell sx={{ color: "#fff" }}>No</TableCell>
                <TableCell sx={{ color: "#fff" }}>Stylist Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  <TableSortLabel
                    active
                    direction={sortOrder}
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    sx={{
                      color: "#fff !important",
                      "& .MuiTableSortLabel-icon": { color: "#fff !important" },
                    }}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleData.length > 0 ? (
                scheduleData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleDeleteSchedule(item.name, item.date)
                        }
                        sx={{ color: "red" }} // Thay hàm gọi để xóa
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No stylist available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleAddSchedule}
            sx={{ backgroundColor: "#4CAF50", color: "#fff" }}
          >
            Add New Schedule
          </Button>
        </Box>
        {/* Modal để thêm hoặc chỉnh sửa stylist */}

        <Modal open={addOpen} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            {/* Thêm bộ chọn ngày */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 200 }}
                  />
                )}
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Prevents selection of today and past dates
              />
            </Box>

            <Typography
              variant="h5"
              sx={{ mb: 2, textAlign: "center", color: "#4CAF50" }}
            >
              Select Stylists for{" "}
              {selectedDate
                ? selectedDate.toLocaleDateString()
                : "Select a date"}
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#4CAF50" }}>
                    <TableCell sx={{ color: "#fff" }}>No.</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Stylist Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Select</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stylistData.map((stylist, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{stylist.stylistName}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedStylists.includes(
                            stylist.stylistName
                          )}
                          onChange={() =>
                            handleSelectStylist(stylist.stylistName)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant="contained"
              onClick={handleSaveStylists} // Gọi hàm mới để lưu stylist
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                "&:hover": {
                  backgroundColor: "#388E3C",
                },
                mt: 2,
                width: "100%",
              }}
            >
              Save New Schedule
            </Button>

            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                "&:hover": {
                  backgroundColor: "#388E3C",
                },
                mt: 2,
                width: "100%",
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}
