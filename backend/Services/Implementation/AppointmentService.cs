using backend.Dtos.Appointments;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using System;
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
        return await _appointmentRepo.CreateAppointmentAsync(appointment);
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
            string body = $"Chào {user.LastName}, bạn đã hủy lịch hẹn {appointment.Description} vào {appointment.AppointmentDate}. Nếu bạn cần đặt lại lịch, vui lòng liên hệ với chúng tôi.";
            await _emailService.SendEmailAsync(user.Email, subject, body);
        }
        return true;
    }

    public async Task<Appointment> UpdateAppointmentAsync(Guid id, AppointmentDto appointmentDto)
    {
        return await _appointmentRepo.UpdateAppointmentAsync(id, appointmentDto);
    }
}
