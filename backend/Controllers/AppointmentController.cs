using AutoMapper;
using backend.Dtos.Appointments;
using backend.Models;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IMapper _mapper;

        public AppointmentController(IAppointmentService appointmentService, IMapper mapper)
        {
            _appointmentService = appointmentService;
            _mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto appointmentDto)
        {
            try
            {
                var appointment = await _appointmentService.CreateAppointmentAsync(appointmentDto);
                var appointmentResponse = _mapper.Map<AppointmentDto>(appointment); // Chuyển thành DTO
                return Ok(new { Message = "Appointment created successfully!", Appointment = appointmentResponse });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            var appointmentDtos = _mapper.Map<List<AppointmentDto>>(appointments);
            return Ok(appointmentDtos);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            var appointments = await _appointmentService.GetAppointmentsByUserIdAsync(id);
            if (appointments == null || !appointments.Any())
                return NotFound();

            var appointmentDtos = _mapper.Map<List<AppointmentDto>>(appointments);
            return Ok(appointmentDtos);
        }
        
        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetAppointmentsByStatus(string status)
        {
            var validStatuses = new[] { "Scheduled", "Reminded", "Completed" };
            if (!validStatuses.Contains(status))
                return BadRequest(new { Message = "Invalid status value" });

            var appointments = await _appointmentService.GetAppointmentsByStatusAsync(status);
            var appointmentDtos = _mapper.Map<List<AppointmentDto>>(appointments);
            return Ok(appointmentDtos);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateAppointment([FromBody] UpdateAppointmentDto appointmentDto)
        {
            try 
            {
                var appointment = await _appointmentService.UpdateAppointmentAsync(appointmentDto);
                if (appointment == null)
                    return NotFound(new { Message = "Appointment not found" });

                var appointmentResponse = _mapper.Map<AppointmentDto>(appointment);
                return Ok(new { Message = "Appointment updated successfully!", Appointment = appointmentResponse });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var success = await _appointmentService.DeleteAppointmentAsync(id);
            if (!success)
                return NotFound(new { Message = "Appointment not found" });

            return Ok(new { Message = "Appointment deleted successfully!" });
        }
    }
}
