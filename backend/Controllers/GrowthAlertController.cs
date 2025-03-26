using backend.Models;
using backend.Services.Interface;
using backend.Dtos.GrowthAlerts;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrowthAlertController : ControllerBase
    {
        private readonly IGrowthAlertService _service;

        public GrowthAlertController(IGrowthAlertService service)
        {
            _service = service;
        }

        // GET: api/GrowthAlert
        [HttpGet]
        public async Task<IActionResult> GetAllAlerts()
        {
            var alertDtos = await _service.GetAllAlertsAsync();
            return Ok(alertDtos);
        }

        // GET: api/GrowthAlert/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GrowthAlertDto>> GetAlertById(int id)
        {
            var alert = await _service.GetAlertByIdAsync(id);
            if (alert == null)
            {
                return NotFound();
            }
            return Ok(alert);
        }

        // GET: api/GrowthAlert/measurement/5
        [HttpGet("measurement/{measurementId}")]
        public async Task<ActionResult<IEnumerable<GrowthAlertDto>>> GetAlertsByMeasurementId(int measurementId)
        {
            var alerts = await _service.GetAlertsByMeasurementIdAsync(measurementId);
            return Ok(alerts);
        }


        // GET: api/GrowthAlert/customer/5/week
        [HttpGet("{userId}/week")]
        public async Task<ActionResult<IEnumerable<GrowthAlertDto>>> GetAlertsByUserIdWithWeek(int userId)
        {
            var alerts = await _service.GetAlertsByUserIdWithWeekAsync(userId);
            return Ok(alerts);
        }

        // GET: api/GrowthAlert/profile/5
        [HttpGet("profile/{profileId}")]
        public async Task<ActionResult<IEnumerable<GrowthAlertDto>>> GetAlertsByProfileId(int profileId)
        {
            var alerts = await _service.GetAlertsByProfileIdAsync(profileId);
            return Ok(alerts);
        }

        // POST: api/GrowthAlert
        [HttpPost]
        public async Task<ActionResult> CreateAlert(CreateGrowthAlertDto alertDto)
        {
            // Convert DTO to entity or pass directly to service
            var alert = new GrowthAlert
            {
                MeasurementId = alertDto.MeasurementId,
                AlertMessage = alertDto.AlertMessage,
                CreatedAt = DateTime.Now
            };
            
            await _service.CreateAlertAsync(alert);
            
            // Create a response DTO instead of returning the entity
            var createdAlertDto = await _service.GetAlertByIdAsync(alert.Id);
            return CreatedAtAction(nameof(GetAlertById), new { id = alert.Id }, createdAlertDto);
        }

        // PUT: api/GrowthAlert/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAlert(int id, UpdateGrowthAlertDto alertDto)
        {
            // Check if the alert exists
            var existingAlertDto = await _service.GetAlertByIdAsync(id);
            if (existingAlertDto == null)
            {
                return NotFound();
            }
            
            // Use the updated service method
            await _service.UpdateAlertAsync(id, alertDto);
            return NoContent();
        }

        // DELETE: api/GrowthAlert/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAlert(int id)
        {
            await _service.DeleteAlertAsync(id);
            return NoContent();
        }
    }
}
