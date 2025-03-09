using backend.Dtos.Appointments;
using backend.Models;

namespace backend.Services.Interface
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAppointmentAsync(AppointmentDto appointmentDto);
        Task<bool> CancelAppointmentAsync(Guid id);
        Task<Appointment> UpdateAppointmentAsync(Guid id, AppointmentDto appointmentDto);
    }

}
