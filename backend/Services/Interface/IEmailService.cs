using backend.Dtos;

namespace backend.Services.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task ScheduleEmailAsync(ScheduledEmailDto emailDto);
    }


}
