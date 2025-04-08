import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: "",
    title: "",
    appointmentDate: "",
    selectedSlot: "",
    description: "",
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete modal
  const [appointmentToDelete, setAppointmentToDelete] = useState(null); // Track appointment to delete
  const [statusOptions] = useState(["Scheduled", "Reminded"]); // For display only
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userId = sessionStorage.getItem("userID");
      if (!userId) {
        toast.error("Please log in to view your prenatal appointments.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5254/api/appointments/get/${userId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
        toast.info("No appointments found.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAppointments([]);
        toast.info("No appointments found for this user.");
      } else {
        toast.error(`Error fetching appointments: ${error.message}`);
      }
    }
  };

  const handleViewClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleEditClick = (appointment) => {
    if (!appointment || !appointment.id || !appointment.appointmentDate) {
      toast.error("Invalid appointment selected.");
      return;
    }
    setSelectedAppointment(appointment);
    const dateTime = new Date(appointment.appointmentDate);
    if (isNaN(dateTime.getTime())) {
      toast.error("Invalid appointment date format.");
      return;
    }
    const formattedDate = dateTime.toISOString().split("T")[0];
    const hours = dateTime.getUTCHours().toString().padStart(2, "0");
    const minutes = dateTime.getUTCMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    setEditFormData({
      id: appointment.id,
      title: appointment.title || "",
      appointmentDate: formattedDate,
      selectedSlot: formattedTime,
      description: appointment.description || "",
    });
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotClick = (slot) => {
    setEditFormData((prev) => ({
      ...prev,
      selectedSlot: slot,
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) {
      toast.error("No appointment selected for update.");
      return;
    }

    if (!editFormData.appointmentDate || !editFormData.selectedSlot) {
      toast.error("Please select both a date and a time slot.");
      return;
    }

    const [hours, minutes] = editFormData.selectedSlot.split(":");
    const selectedDateTime = new Date(
      `${editFormData.appointmentDate}T${hours}:${minutes}:00Z`
    );
    if (isNaN(selectedDateTime.getTime())) {
      toast.error("Invalid date or time.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5254/api/appointments/update`,
        {
          id: parseInt(editFormData.id),
          appointmentDate: selectedDateTime.toISOString(),
          title: editFormData.title,
          description: editFormData.description,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        toast.success("Appointment updated successfully!");
        fetchAppointments();
        setShowEditModal(false);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.error(
        `Error updating appointment: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5254/api/appointments/delete/${appointmentToDelete.id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        toast.success("Appointment deleted successfully!");
        fetchAppointments();
        setShowViewModal(false);
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.error(
        `Error deleting appointment: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="va-wrapper">
      <ToastContainer autoClose={1300} />
      <style>
        {`
          .va-wrapper {
            padding: 25px;
            max-width: 1200px;
            margin: 0 auto;
            margin-top: 100px;
            font-family: 'Georgia', serif;
            background: transparent; /* Let global gradient show through */
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(240, 98, 146, 0.1);
          }

          .va-top-section {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 35px;
            background: linear-gradient(to right, #fce4ec, #fff1f5);
            padding: 20px;
            border-radius: 20px;
            border: 1px solid #f8bbd0;
          }

          .va-baby-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #fff;
            padding: 10px;
            border: 3px solid #f06292;
          }

          .va-title {
            color: #f06292;
            font-size: 30px;
            font-weight: 600;
          }

          .va-content {
            padding: 30px;
            background: #ffffff;
            border-radius: 25px;
            border: 1px solid #fce4ec;
          }

          .va-list {
            max-height: 600px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #f8bbd0 #fff5f7;
          }

          .va-appointment-item {
            border: 1px solid #f8bbd0;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 15px;
            background: #fffafc;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .va-appointment-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(240, 98, 146, 0.15);
          }

          .va-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 18px;
            color: #880e4f;
          }

          .va-status {
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
          }

          .va-status-scheduled {
            background: #f8bbd0;
            color: #fff;
          }
          .va-status-reminded {
            background: #ffb300;
            color: #fff;
          }

          .va-pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
          }

          .va-pagination button {
            padding: 8px 12px;
            border: 1px solid #f8bbd0;
            border-radius: 5px;
            background: #fffafc;
            color: #880e4f;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .va-pagination button:hover {
            background: #f8bbd0;
            color: #fff;
          }

          .va-pagination button.active {
            background: #f06292;
            color: #fff;
            border-color: #f06292;
          }

          .va-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .va-modal-content {
            background: #fff7f9;
            padding: 35px;
            border-radius: 20px;
            width: 500px;
            box-shadow: 0 6px 20px rgba(240, 98, 146, 0.25);
            border: 1px solid #f8bbd0;
          }

          .va-modal-content h2 {
            color: #f06292;
            font-size: 26px;
            margin-bottom: 25px;
            text-align: center;
          }

          .va-view-details p {
            margin: 10px 0;
            color: #880e4f;
            font-size: 16px;
          }

          .va-modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            justify-content: center;
          }

          .va-modal-actions button,
          .va-modal-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Georgia', serif;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .va-modal-actions button:nth-child(1) {
            background: #ffca28;
            color: #fff;
          }

          .va-modal-actions button:nth-child(1):hover {
            background: #ffb300;
          }

          .va-modal-actions button:nth-child(2) {
            background: #f06292;
            color: #fff;
          }

          .va-modal-actions button:nth-child(2):hover {
            background: #d81b60;
          }

          .va-modal-actions button:nth-child(3) {
            background: #ccc;
            color: #333;
          }

          .va-modal-actions button:nth-child(3):hover {
            background: #bbb;
          }

          .va-form-group {
            margin-bottom: 25px;
          }

          .va-form-group label {
            display: block;
            margin-bottom: 8px;
            color: #f06292;
            font-size: 16px;
            font-weight: 500;
          }

          .va-form-group input,
          .va-form-group select,
          .va-form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #f8bbd0;
            border-radius: 12px;
            font-family: 'Georgia', serif;
            font-size: 14px;
            background: #fffafc;
            color: #880e4f;
            transition: border-color 0.3s ease;
          }

          .va-form-group input:focus,
          .va-form-group select:focus,
          .va-form-group textarea:focus {
            border-color: #f06292;
            outline: none;
          }

          .va-time-slots {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 12px;
          }

          .va-time-slots button {
            padding: 10px;
            border: 1px solid #f8bbd0;
            border-radius: 12px;
            background: #fffafc;
            color: #880e4f;
            cursor: pointer;
            font-family: 'Georgia', serif;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          .va-time-slots button:hover {
            background: #f8bbd0;
            color: #fff;
          }

          .va-time-slots button.selected {
            background: #f06292;
            color: #fff;
            border-color: #f06292;
          }

          .va-save-btn {
            background: #f06292;
            color: #fff;
            margin-right: 15px;
          }

          .va-save-btn:hover {
            background: #d81b60;
          }

          .va-cancel-btn {
            background: #ccc;
            color: #333;
          }

          .va-cancel-btn:hover {
            background: #bbb;
          }

          .va-delete-modal-content {
            background: #fff7f9;
            padding: 25px;
            border-radius: 20px;
            width: 400px;
            box-shadow: 0 6px 20px rgba(240, 98, 146, 0.25);
            border: 1px solid #f8bbd0;
            text-align: center;
          }

          .va-delete-modal-content p {
            color: #880e4f;
            font-size: 18px;
            margin-bottom: 20px;
          }

          .va-delete-modal-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
          }

          .va-delete-modal-actions button {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Georgia', serif;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .va-delete-modal-actions button:nth-child(1) {
            background: #f06292;
            color: #fff;
          }

          .va-delete-modal-actions button:nth-child(1):hover {
            background: #d81b60;
          }

          .va-delete-modal-actions button:nth-child(2) {
            background: #ccc;
            color: #333;
          }

          .va-delete-modal-actions button:nth-child(2):hover {
            background: #bbb;
          }
        `}
      </style>

      <div className="va-top-section">
        <img
          src="images/favicon.ico"
          alt="Baby Icon"
          className="va-baby-icon"
        />
        <div className="va-title">Your Appointments</div>
      </div>
      <div className="va-content">
        <div className="va-list">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="va-appointment-item"
                onClick={() => handleViewClick(appointment)}
              >
                <div className="va-item-header">
                  <strong>{appointment.title || "Prenatal Checkup"}</strong>
                  <span
                    className={`va-status va-status-${appointment.status?.toLowerCase()}`}
                  >
                    {appointment.status || "Scheduled"}
                  </span>
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </div>
                <div>
                  <strong>Time:</strong>{" "}
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "N/A"}
                </div>
              </div>
            ))
          ) : (
            <p>No prenatal appointments scheduled yet.</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="va-pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {showViewModal && selectedAppointment && (
        <div className="va-modal">
          <div className="va-modal-content">
            <h2>Appointment Details</h2>
            <div className="va-view-details">
              <p>
                <strong>Title:</strong> {selectedAppointment.title || "N/A"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  selectedAppointment.appointmentDate
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(
                  selectedAppointment.appointmentDate
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Details:</strong>{" "}
                {selectedAppointment.description || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedAppointment.status || "N/A"}
              </p>
            </div>
            <div className="va-modal-actions">
              <button onClick={() => handleEditClick(selectedAppointment)}>
                Edit
              </button>
              <button onClick={() => handleDeleteClick(selectedAppointment)}>
                Delete
              </button>
              <button onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="va-modal">
          <div className="va-modal-content">
            <h2>Edit Your Prenatal Appointment</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="va-form-group">
                <label>Appointment Title*</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  placeholder="e.g., Ultrasound Checkup"
                  required
                />
              </div>
              <div className="va-form-group">
                <label>Appointment Date*</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={editFormData.appointmentDate}
                  onChange={handleEditChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="va-form-group">
                <label>Appointment Time*</label>
                <div className="va-time-slots">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={
                        editFormData.selectedSlot === slot ? "selected" : ""
                      }
                      onClick={() => handleSlotClick(slot)}
                      disabled={!editFormData.appointmentDate}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="va-form-group">
                <label>Details</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  placeholder="e.g., Discuss baby’s growth"
                  rows="4"
                />
              </div>
              <button type="submit" className="va-modal-btn va-save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="va-modal-btn va-cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="va-modal">
          <div className="va-delete-modal-content">
            <p>Are you sure you want to delete?</p>
            <div className="va-delete-modal-actions">
              <button onClick={handleDeleteConfirm}>Delete</button>
              <button onClick={handleDeleteCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;
