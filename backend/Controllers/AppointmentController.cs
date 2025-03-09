using backend.Dtos.Appointments;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentDto dto)
        {
            var appointment = await _appointmentService.CreateAppointmentAsync(dto);
            return Ok(appointment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelAppointment(Guid id)
        {
            var success = await _appointmentService.CancelAppointmentAsync(id);
            if (!success) return NotFound("Appointment not found");
            return Ok("Appointment cancelled successfully, confirmation email sent.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(Guid id, [FromBody] AppointmentDto dto)
        {
            var updatedAppointment = await _appointmentService.UpdateAppointmentAsync(id, dto);
            if (updatedAppointment == null) return NotFound("Appointment not found");
            return Ok(updatedAppointment);
        }
    }
}
