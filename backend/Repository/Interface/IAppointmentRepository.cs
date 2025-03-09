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
    }

}
