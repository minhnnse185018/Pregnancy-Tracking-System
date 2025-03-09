using backend.Services.Interface;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Net.Mail;
using System.Net;
using System.Threading.Tasks;

namespace backend.Services.Implementation
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                using (var client = new System.Net.Mail.SmtpClient(_config["Smtp:Host"]))
                {
                    client.Port = int.Parse(_config["Smtp:Port"]);
                    client.Credentials = new NetworkCredential(_config["Smtp:Username"], _config["Smtp:Password"]);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_config["Smtp:Username"]),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };
                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                    Console.WriteLine($"✅ Email sent successfully to {toEmail}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Failed to send email: {ex.Message}");
            }
        }

    }
}
