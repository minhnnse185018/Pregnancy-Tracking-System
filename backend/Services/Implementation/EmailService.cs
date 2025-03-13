using backend.Services.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using backend.Helper;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using backend.Dtos;
using backend.Models;
using backend.Data;

namespace backend.Services.Implementation
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ApplicationDBContext _context;

        public EmailService(IOptions<EmailSettings> emailSettings, ApplicationDBContext context)
        {
            _emailSettings = emailSettings.Value;
            _context = context;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Admin", _emailSettings.SenderEmail));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = body };

            using var client = new SmtpClient();
            await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, _emailSettings.UseSSL);
            await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.SenderPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        public async Task ScheduleEmailAsync(ScheduledEmailDto emailDto)
        {
            var email = new ScheduledEmail
            {
                RecipientEmail = emailDto.RecipientEmail,
                Subject = emailDto.Subject,
                Body = emailDto.Body,
                ScheduledTime = emailDto.ScheduledTime,
                IsSent = false
            };

            _context.ScheduledEmails.Add(email);
            await _context.SaveChangesAsync();
        }
    }
}
