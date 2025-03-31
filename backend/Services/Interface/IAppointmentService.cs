using backend.Dtos.Appointments;
using backend.Models;

namespace backend.Services.Interface
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAppointmentAsync(CreateAppointmentDto appointmentDto);
        Task<List<Appointment>> GetAllAppointmentsAsync(); 
        Task<Appointment?> GetAppointmentByIdAsync(int id); 
        Task<List<Appointment>> GetAppointmentsByStatusAsync(string status); 
        Task<bool> CancelAppointmentAsync(int id);
        Task<Appointment?> UpdateAppointmentAsync(UpdateAppointmentDto appointmentDto);
        Task SendAppointmentRemindersAsync();
        Task UpdateCompletedAppointmentsAsync(); 
        Task <List<Appointment>> GetAppointmentsByUserIdAsync(int userId);
        Task<bool> DeleteAppointmentAsync(int id);
    }
}
