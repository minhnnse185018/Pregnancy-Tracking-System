using System;
using backend.Data;
using backend.Dtos.Appointments;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using Google;
using Hangfire.States;
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

        public async Task<Appointment?> UpdateAppointmentAsync(UpdateAppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == appointmentDto.Id);

            if (appointment == null) return null;

            // Update only allowed fields
            appointment.Title = appointmentDto.Title;
            appointment.Description = appointmentDto.Description;
            appointment.AppointmentDate = appointmentDto.AppointmentDate;
            
            try
            {
                await _context.SaveChangesAsync();
                return appointment;
            }
            catch (Exception)
            {
                return null;
            }
        }
        

        public async Task<List<Appointment>> GetUpcomingAppointmentsAsync(DateTime reminderTime)
        {
            return await _context.Appointments
                .Where(a => a.Status == "Scheduled" && !a.ReminderSent && a.AppointmentDate > DateTime.UtcNow && a.AppointmentDate <= reminderTime)
                .Include(a => a.User)
                .ToListAsync();
        }

        public Task<List<Appointment>> GetAppointmentsByUserIdAsync(int userId)
        {
            return _context.Appointments
                .Where(a => a.UserId == userId)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            _context.Appointments.Remove(appointment);
            return await _context.SaveChangesAsync()>0?true:false;
        }
    }
}
