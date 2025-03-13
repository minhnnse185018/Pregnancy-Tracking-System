using System;
using backend.Data;
using backend.Repository.Interface;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class AppointmentReminderService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public AppointmentReminderService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                // Lấy danh sách cuộc hẹn sắp diễn ra trong vòng 7 giờ và chưa gửi email
                var now = DateTime.UtcNow;
                var upcomingAppointments = await context.Appointments
                    .Where(a => a.Status == "Scheduled" && a.AppointmentDate <= now.AddHours(7) && a.AppointmentDate > now)
                    .ToListAsync();

                foreach (var appointment in upcomingAppointments)
                {
                    string subject = "Nhắc nhở cuộc hẹn sắp diễn ra!";
                    string body = $"Xin chào,<br><br> Bạn có một cuộc hẹn '{appointment.Title}' vào lúc {appointment.AppointmentDate}.<br><br> Hãy chuẩn bị sẵn sàng!";

                    await emailService.SendEmailAsync(appointment.User.Email, subject, body);

                    appointment.Status = "Reminded";
                }

                await context.SaveChangesAsync();

                // Chạy lại sau mỗi 1 phút
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
