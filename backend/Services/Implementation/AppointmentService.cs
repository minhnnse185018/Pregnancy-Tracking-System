using backend.Dtos.Appointments;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepo;
    private readonly IEmailService _emailService;
    private readonly IUserRepository _userRepo;

    public AppointmentService(IAppointmentRepository appointmentRepo, IEmailService emailService, IUserRepository userRepo)
    {
        _appointmentRepo = appointmentRepo;
        _emailService = emailService;
        _userRepo = userRepo;
    }

    public async Task<Appointment> CreateAppointmentAsync(AppointmentDto appointmentDto)
    {
        var appointment = new Appointment
        {
            UserId = appointmentDto.UserId,
            Title = appointmentDto.Title,
            Description = appointmentDto.Description,
            AppointmentDate = appointmentDto.AppointmentDate
        };
        var createdAppointment = await _appointmentRepo.CreateAppointmentAsync(appointment);

        var user = await _userRepo.GetUserByIdAsync(appointment.UserId);
        if (user != null)
        {
            string subject = "Xác nhận đặt lịch hẹn";
            string body = $"Chào {user.LastName}, bạn có lịch {appointment.Title} vào {appointment.AppointmentDate}. Vui lòng có mặt đúng giờ.";
            await _emailService.SendEmailAsync(user.Email, subject, body);
        }
        return createdAppointment;
    }

    public async Task SendAppointmentRemindersAsync()
    {
        var now = DateTime.UtcNow;
        var upcomingAppointments = await _appointmentRepo.GetUpcomingAppointmentsAsync();

        foreach (var appointment in upcomingAppointments)
        {
            if ((appointment.AppointmentDate - now).TotalHours <= 1 && appointment.Status == "Scheduled")
            {
                var user = await _userRepo.GetUserByIdAsync(appointment.UserId);
                if (user != null)
                {
                    string subject = "Nhắc nhở lịch hẹn";
                    string body = $"Chào {user.LastName}, bạn có lịch {appointment.Title} vào {appointment.AppointmentDate}. Vui lòng có mặt đúng giờ.";
                    await _emailService.SendEmailAsync(user.Email, subject, body);
                }
            }
        }
    }

    public async Task<bool> CancelAppointmentAsync(Guid id)
    {
        var success = await _appointmentRepo.CancelAppointmentAsync(id);
        if (!success) return false;

        var appointment = await _appointmentRepo.GetAppointmentByIdAsync(id);
        var user = await _userRepo.GetUserByIdAsync(appointment.UserId);
        if (user != null)
        {
            string subject = "Xác nhận hủy lịch hẹn";
            string body = $"Chào {user.LastName}, bạn đã hủy {appointment.Description} vào {appointment.AppointmentDate}. Nếu bạn cần đặt lại lịch, vui lòng liên hệ với chúng tôi.";
            await _emailService.SendEmailAsync(user.Email, subject, body);
        }
        return true;
    }

    public async Task<Appointment> UpdateAppointmentAsync(Guid id, AppointmentDto appointmentDto)
    {
        return await _appointmentRepo.UpdateAppointmentAsync(id, appointmentDto);
    }
}
