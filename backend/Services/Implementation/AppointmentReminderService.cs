using backend.Repository.Interface;
using backend.Services.Interface;

namespace backend.Services.Implementation
{
    public class AppointmentReminderService : IAppointmentReminderService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IEmailService _emailService;

        public AppointmentReminderService(IAppointmentRepository appointmentRepository, IEmailService emailService)
        {
            _appointmentRepository = appointmentRepository;
            _emailService = emailService;
        }

        public async Task SendAppointmentReminders()
        {
            var now = DateTime.UtcNow;
            var oneHourLater = now.AddHours(1); // Lấy thời điểm 1 tiếng sau

            var upcomingAppointments = await _appointmentRepository.GetAppointmentsInTimeRange(now, oneHourLater);

            foreach (var appointment in upcomingAppointments)
            {
                var emailBody = $"Xin chào, bạn có lịch hẹn '{appointment.Title}' vào {appointment.AppointmentDate:HH:mm dd/MM/yyyy}. Vui lòng đến đúng giờ!";
                await _emailService.SendEmailAsync(appointment.User.Email, "Nhắc lịch hẹn", emailBody);
            }
        }

    }
}
