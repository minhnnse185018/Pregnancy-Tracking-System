using backend.Dtos.Appointments;

namespace backend.Services.Interface
{
    public interface IAppointmentService
    {
        Task<AppointmentDto> GetAppointmentByIdAsync(int id);
        Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync();
        Task CreateAppointmentAsync(AppointmentDto appointmentDto);
        Task UpdateAppointmentAsync(AppointmentDto appointmentDto);
        Task DeleteAppointmentAsync(int id);
    }
}
