using backend.Dtos.Appointments;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    using backend.Models;
    using System;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using backend.Data;
    using AutoMapper;

    [Route("api/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IMapper _mapper; // Thêm IMapper nếu dùng AutoMapper

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

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentDto appointmentDto)
        {
            var appointment = await _appointmentService.UpdateAppointmentAsync(id, appointmentDto);
            if (appointment == null)
                return NotFound(new { Message = "Appointment not found" });

            var appointmentResponse = _mapper.Map<AppointmentDto>(appointment); // Chuyển thành DTO
            return Ok(new { Message = "Appointment updated successfully!", Appointment = appointmentResponse });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var success = await _appointmentService.CancelAppointmentAsync(id);
            if (!success)
                return NotFound(new { Message = "Appointment not found" });

            return Ok(new { Message = "Appointment cancelled successfully!" });
        }
    }

}
