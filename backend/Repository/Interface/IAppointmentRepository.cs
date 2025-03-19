using backend.Dtos.Appointments;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IAppointmentRepository
    {
        Task<Appointment> CreateAppointmentAsync(Appointment appointment);
        Task<Appointment?> GetAppointmentByIdAsync(int id);
        Task<List<Appointment>> GetAllAppointmentsAsync(); // Thêm để lấy tất cả
        Task<List<Appointment>> GetAppointmentsByStatusAsync(string status); // Thêm để lấy theo Status
        Task<bool> CancelAppointmentAsync(int id);
        Task<Appointment?> UpdateAppointmentAsync(UpdateAppointmentDto appointment);
        Task<List<Appointment>> GetUpcomingAppointmentsAsync(DateTime reminderTime);
        Task<List<Appointment>> GetAppointmentsByUserIdAsync(int userId);
        Task<bool> DeleteAppointmentAsync(int id);
    }

}
