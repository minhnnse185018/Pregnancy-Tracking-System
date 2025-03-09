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

        public async Task<Appointment> GetAppointmentByIdAsync(Guid id)
        {
            return await _context.Appointments.FindAsync(id);
        }

        public async Task<bool> CancelAppointmentAsync(Guid id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;
            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Appointment> UpdateAppointmentAsync(Guid id, AppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return null;

            appointment.Description = appointmentDto.Description;
            appointment.AppointmentDate = appointmentDto.AppointmentDate;
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<List<Appointment>> GetUpcomingAppointmentsAsync()
        {
            return await _context.Appointments
                .Where(a => a.AppointmentDate > DateTime.UtcNow && a.Status == "Scheduled")
                .ToListAsync();
        }

    }
}
