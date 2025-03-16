using System;
using backend.Data;
using backend.Dtos.Appointments;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using Google;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDBContext _context;

        public AppointmentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id);
        }
        public async Task<List<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.User) // Bao gồm thông tin User nếu cần
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetAppointmentsByStatusAsync(string status)
        {
            return await _context.Appointments
                .Where(a => a.Status == status)
                .Include(a => a.User) // Bao gồm thông tin User nếu cần
                .ToListAsync();
        }

        public async Task<bool> CancelAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;
            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Appointment?> UpdateAppointmentAsync(int id, AppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return null;

            appointment.Title = appointmentDto.Title;
            appointment.Description = appointmentDto.Description;
            appointment.AppointmentDate = appointmentDto.AppointmentDate;
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<List<Appointment>> GetUpcomingAppointmentsAsync(DateTime reminderTime)
        {
            return await _context.Appointments
                .Where(a => a.Status == "Scheduled" && !a.ReminderSent && a.AppointmentDate > DateTime.UtcNow && a.AppointmentDate <= reminderTime)
                .Include(a => a.User)
                .ToListAsync();
        }
    }
}
