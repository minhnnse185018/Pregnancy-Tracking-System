using System;
using backend.Data;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class ScheduledEmailService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public ScheduledEmailService(IServiceProvider serviceProvider)
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

                var pendingEmails = await context.ScheduledEmails
                .Where(e => !e.IsSent && e.ScheduledTime <= DateTime.UtcNow.AddHours(7)) // Chỉ lấy email cần gửi trước 7 tiếng
                .ToListAsync();


                foreach (var email in pendingEmails)
                {
                    await emailService.SendEmailAsync(email.RecipientEmail, email.Subject, email.Body);
                    email.IsSent = true;
                }

                await context.SaveChangesAsync();

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
