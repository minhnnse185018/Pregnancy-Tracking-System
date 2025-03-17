using backend.Data;
using backend.Dtos.Appointments;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services.Implementation
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly IEmailService _emailService;
        private readonly IUserRepository _userRepo;
        private readonly ApplicationDBContext _context;
        private readonly ILogger<AppointmentService> _logger;

        public AppointmentService(
            IAppointmentRepository appointmentRepo,
            IEmailService emailService,
            IUserRepository userRepo,
            ApplicationDBContext context,
            ILogger<AppointmentService> logger)
        {
            _appointmentRepo = appointmentRepo;
            _emailService = emailService;
            _userRepo = userRepo;
            _context = context;
            _logger = logger;
        }

        public async Task<Appointment> CreateAppointmentAsync(CreateAppointmentDto appointmentDto)
        {
            var appointment = new Appointment
            {
                UserId = appointmentDto.UserId,
                Title = appointmentDto.Title,
                Description = appointmentDto.Description,
                AppointmentDate = appointmentDto.AppointmentDate,
                Status = "Scheduled",
                ReminderSent = false
            };

            var createdAppointment = await _appointmentRepo.CreateAppointmentAsync(appointment);

            var user = await _userRepo.GetUserByIdAsync(appointment.UserId);
            if (user != null)
            {
                // Gửi email xác nhận
                string confirmSubject = "Confirm appointment";
                string confirmBody = $"Hello {user.LastName}, you have a '{appointment.Title}' appointment at {appointment.AppointmentDate}. Please be on time!";
                await _emailService.SendEmailAsync(user.Email, confirmSubject, confirmBody);

                // Tạo ScheduledEmail
                var reminderTime = appointment.AppointmentDate.AddHours(-7);
                var scheduledEmail = new ScheduledEmail
                {
                    AppointmentId = createdAppointment.Id,
                    RecipientEmail = user.Email,
                    Subject = "Appointment Reminder",
                    Body = $"Hello {user.LastName}, you have a '{appointment.Title}' appointment at {appointment.AppointmentDate}. Be prepared!",
                    ScheduledTime = reminderTime,
                    IsSent = false
                };
                _context.ScheduledEmails.Add(scheduledEmail);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Created ScheduledEmail for AppointmentId {Id} with ScheduledTime {Time}", createdAppointment.Id, reminderTime);
            }

            return createdAppointment;
        }

        public async Task<bool> CancelAppointmentAsync(int id)
        {
            var success = await _appointmentRepo.CancelAppointmentAsync(id);
            if (!success) return false;

            var appointment = await _appointmentRepo.GetAppointmentByIdAsync(id);
            var user = await _userRepo.GetUserByIdAsync(appointment.UserId);
            if (user != null)
            {
                string subject = "Confirm appointment cancellation";
                string body = $"Hello {user.LastName}, you have cancelled '{appointment.Title}' appointment at {appointment.AppointmentDate}. If you need to reset, please contact us!";
                await _emailService.SendEmailAsync(user.Email, subject, body);
            }
            return true;
        }

        public async Task<Appointment?> UpdateAppointmentAsync(UpdateAppointmentDto appointmentDto)
        {
            return await _appointmentRepo.UpdateAppointmentAsync(appointmentDto);
        }
        

        public async Task SendAppointmentRemindersAsync()
        {
            var now = DateTime.UtcNow;
            var scheduledEmails = await _context.ScheduledEmails
                .Where(e => !e.IsSent && e.ScheduledTime <= now)
                .Include(e => e.Appointment)
                .ThenInclude(a => a.User)
                .ToListAsync();

            _logger.LogInformation("Found {Count} scheduled emails to process at {Time}", scheduledEmails.Count, now);

            foreach (var email in scheduledEmails)
            {
                if (email.Appointment.Status == "Scheduled")
                {
                    try
                    {
                        // Gửi email nhắc nhở
                        await _emailService.SendEmailAsync(email.RecipientEmail, email.Subject, email.Body);
                        email.IsSent = true;
                        email.Appointment.ReminderSent = true;
                        email.Appointment.Status = "Reminded";
                        _logger.LogInformation("Sent reminder email for AppointmentId {Id}", email.AppointmentId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to send reminder email for AppointmentId {Id}", email.AppointmentId);
                    }
                }
            }
            await _context.SaveChangesAsync();
        }

        // Thêm phương thức để cập nhật trạng thái thành Completed khi đến giờ
        public async Task UpdateCompletedAppointmentsAsync()
        {
            var now = DateTime.UtcNow;
            var appointments = await _context.Appointments
                .Where(a => a.Status == "Reminded" && a.AppointmentDate <= now)
                .ToListAsync();

            foreach (var appointment in appointments)
            {
                appointment.Status = "Completed";
                _logger.LogInformation("Updated AppointmentId {Id} to Completed", appointment.Id);
            }
            await _context.SaveChangesAsync();
        }
        public async Task<List<Appointment>> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentRepo.GetAllAppointmentsAsync();
            _logger.LogInformation("Retrieved {Count} appointments", appointments.Count);
            return appointments;
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _appointmentRepo.GetAppointmentByIdAsync(id);
            if (appointment == null)
            {
                _logger.LogWarning("Appointment with Id {Id} not found", id);
            }
            else
            {
                _logger.LogInformation("Retrieved appointment with Id {Id}", id);
            }
            return appointment;
        }

        public async Task<List<Appointment>> GetAppointmentsByStatusAsync(string status)
        {
            var appointments = await _appointmentRepo.GetAppointmentsByStatusAsync(status);
            _logger.LogInformation("Retrieved {Count} appointments with Status {Status}", appointments.Count, status);
            return appointments;
        }

        public async Task<List<Appointment>> GetAppointmentsByUserIdAsync(int userId)
        {
            return await _appointmentRepo.GetAppointmentsByUserIdAsync(userId);
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            return await _appointmentRepo.DeleteAppointmentAsync(id);
        }
    }
}