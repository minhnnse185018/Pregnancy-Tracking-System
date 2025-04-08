import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    appointmentDate: "",
    selectedSlot: "",
    description: "",
  });
  const [showRedirectButton, setShowRedirectButton] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlotClick = (slot) => {
    setFormData({ ...formData, selectedSlot: slot });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push(`${hour}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      toast.error("User not logged in. Please log in first.");
      return;
    }

    let selectedDateTime = null;

    try {
      if (formData.appointmentDate && formData.selectedSlot) {
        // Create a valid date string by combining date and time
        const dateStr = formData.appointmentDate;
        const timeStr = formData.selectedSlot;

        // Parse the date and time separately
        const [year, month, day] = dateStr.split("-").map(Number);
        const [hours] = timeStr.split(":").map(Number);

        // Create a new Date object with the parsed values and adjust for timezone
        const date = new Date();
        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(day);
        date.setHours(hours, 0, 0, 0);

        // Check if the date is valid
        if (!isNaN(date.getTime())) {
          // Create ISO string and preserve the local time
          const offset = date.getTimezoneOffset();
          const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
          selectedDateTime = adjustedDate.toISOString();
        } else {
          throw new Error("Invalid date or time");
        }
      }
    } catch (error) {
      console.error("Date parsing error:", error);
      toast.error("Invalid date or time selected. Please try again.");
      return;
    }

    if (!selectedDateTime) {
      toast.error("Please select both a date and a time slot.");
      return;
    }

    try {
      const requestData = {
        userId: parseInt(userId),
        appointmentDate: selectedDateTime,
        title: formData.title,
        description: formData.description,
      };

      console.log("Sending data:", JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        "http://localhost:5254/api/appointments/create",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);

      if (
        response.status === 200 &&
        response.data.message === "Appointment created successfully!"
      ) {
        toast.success("Appointment booked successfully!");
        setShowRedirectButton(true);
      } else {
        toast.error("Unexpected response from server. Please try again.");
      }

      setFormData({
        title: "",
        appointmentDate: "",
        selectedSlot: "",
        description: "",
      });
    } catch (error) {
      console.error(
        "Error booking appointment:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        `An error occurred: ${
          error.response ? JSON.stringify(error.response.data) : error.message
        }`
      );
    }
  };

  const handleRedirectToView = () => {
    navigate("/viewappointment", { state: { refresh: true } });
  };

  return (
    <div className="ba-wrapper">
      <ToastContainer autoClose={1300} />
      <div className="ba-top-section">
        <img
          src="images/favicon.ico"
          alt="Baby Icon"
          className="ba-baby-icon"
        />
        <div className="ba-title">Reminder Appointment</div>
      </div>
      <div className="ba-content">
        <div className="ba-form">
          <form onSubmit={handleSubmit}>
            <div className="ba-form-group">
              <label>Appointment Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Appointment with Dr. John Smith..."
                required
              />
            </div>
            <div className="ba-form-group">
              <label>Appointment Date*</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="ba-form-group">
              <label>Appointment Time*</label>
              <div className="ba-time-slots">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={formData.selectedSlot === slot ? "selected" : ""}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!formData.appointmentDate}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="ba-form-group">
              <label>Details</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add details about your appointment..."
                rows="4"
              />
            </div>
            <button type="submit">Create</button>
          </form>
          {showRedirectButton && (
            <button className="ba-redirect-btn" onClick={handleRedirectToView}>
              View Your Reminder
            </button>
          )}
        </div>
        <div className="ba-illustration">
          <img
            src="images/bookappointment.png"
            alt="Doctor and Pregnant Woman"
          />
        </div>
      </div>

      <style>
        {`
          .ba-wrapper {
            padding: 25px;
            max-width: 1200px;
            margin: 0 auto;
            margin-top: 100px;
            font-family: 'Georgia', serif;
            background: #fff7f9;
          }

          .ba-top-section {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 35px;
            background: linear-gradient(to right, #f8e1e9, #fceff2);
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(248, 187, 208, 0.2);
          }

          .ba-baby-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #fff;
            padding: 8px;
            border: 2px solid #f8bbd0;
          }

          .ba-title {
            color: #ec407a;
            font-size: 28px;
            font-weight: 500;
            text-shadow: 1px 1px 3px rgba(236, 64, 122, 0.1);
          }

          .ba-content {
            padding: 30px;
            background: #ffffff;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(248, 187, 208, 0.15);
            border: 1px solid #fce4ec;
            display: flex;
            gap: 30px;
            align-items: flex-start;
          }

          .ba-form {
            flex: 1;
          }

          .ba-form-group {
            margin-bottom: 20px;
          }

          .ba-form-group label {
            display: block;
            margin-bottom: 8px;
            color: #ec407a;
            font-size: 16px;
            font-weight: 500;
          }

          .ba-form-group input,
          .ba-form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #f8bbd0;
            border-radius: 10px;
            font-family: 'Georgia', serif;
            font-size: 16px;
            background: #fffafc;
          }

          .ba-form-group textarea {
            resize: vertical;
          }

          .ba-time-slots {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 10px;
            justify-content: flex-start;
          }

          .ba-time-slots button {
            padding: 8px 12px;
            border: 1px solid #f8bbd0;
            border-radius: 8px;
            background: #fffafc;
            color: #880e4f;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s, color 0.3s;
            text-align: center;
            height: 40px;
          }

          .ba-time-slots button:disabled {
            background: #f5f5f5;
            color: #ccc;
            cursor: not-allowed;
          }

          .ba-time-slots button.selected {
            background: #ec407a;
            color: #fff;
            border-color: #ec407a;
          }

          .ba-form button[type="submit"] {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            background: #ec407a;
            color: #fff;
            cursor: pointer;
            font-size: 16px;
          }

          .ba-redirect-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            background: #ffca28;
            color: #fff;
            cursor: pointer;
            font-size: 16px;
            margin-top: 15px;
            display: block;
            width: 100%;
          }

          .ba-illustration {
            flex: 1;
            text-align: center;
          }

          .ba-illustration img {
            max-width: 100%;
            height: auto;
            border-radius: 15px;
            opacity: 0.9;
            filter: drop-shadow(0 2px 4px rgba(240, 98, 146, 0.2));
          }
        `}
      </style>
    </div>
  );
};

export default BookAppointment;