using System;
using backend.Data;
using backend.Dtos;
using backend.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ApplicationDBContext _context;

        public EmailController(IEmailService emailService, ApplicationDBContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] ScheduledEmailDto emailDto)
        {
            await _emailService.SendEmailAsync(emailDto.RecipientEmail, emailDto.Subject, emailDto.Body);
            return Ok(new { Message = "Email sent successfully" });
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleEmail([FromBody] ScheduledEmailDto emailDto)
        {
            await _emailService.ScheduleEmailAsync(emailDto);
            return Ok(new { Message = "Email scheduled successfully" });
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingEmails()
        {
            var emails = await _context.ScheduledEmails
                .Where(e => !e.IsSent && e.ScheduledTime <= DateTime.UtcNow)
                .ToListAsync();

            return Ok(emails);
        }
    }

}
