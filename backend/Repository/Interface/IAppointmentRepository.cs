using backend.Dtos.Appointments;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IAppointmentRepository
    {
        Task<Appointment> CreateAppointmentAsync(Appointment appointment);
        Task<Appointment> GetAppointmentByIdAsync(Guid id);
        Task<bool> CancelAppointmentAsync(Guid id);
        Task<Appointment> UpdateAppointmentAsync(Guid id, AppointmentDto appointmentDto);
        Task<List<Appointment>> GetUpcomingAppointmentsAsync();
        Task<List<Appointment>> GetUpcomingAppointmentsAsync(DateTime reminderTime);
        Task<List<Appointment>> GetAppointmentsInTimeRange(DateTime from, DateTime to);



    }

}
