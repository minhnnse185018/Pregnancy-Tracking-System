using backend.Dtos.Appointments;
using backend.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // GET: api/appointments
        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentService.GetAllAppointmentsAsync();
            return Ok(appointments);
        }

        // GET: api/appointments/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
            if (appointment == null)
                return NotFound();

            return Ok(appointment);
        }

        // POST: api/appointments
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentDto appointmentDto)
        {
            if (appointmentDto == null)
                return BadRequest();

            await _appointmentService.CreateAppointmentAsync(appointmentDto);
            return CreatedAtAction(nameof(GetAppointmentById), new { id = appointmentDto.Id }, appointmentDto);
        }

        // PUT: api/appointments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentDto appointmentDto)
        {
            if (id != appointmentDto.Id)
                return BadRequest();

            await _appointmentService.UpdateAppointmentAsync(appointmentDto);
            return NoContent();
        }

        // DELETE: api/appointments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            await _appointmentService.DeleteAppointmentAsync(id);
            return NoContent();
        }
    }
}
