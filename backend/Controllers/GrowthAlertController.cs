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
        public async Task<ActionResult<IEnumerable<GrowthAlert>>> GetAllAlerts()
        {
            var alerts = await _service.GetAllAlertsAsync();
            return Ok(alerts);
        }

        // GET: api/GrowthAlert/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GrowthAlert>> GetAlertById(int id)
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
        public async Task<ActionResult<IEnumerable<GrowthAlert>>> GetAlertsByMeasurementId(int measurementId)
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

        // POST: api/GrowthAlert
        [HttpPost]
        public async Task<ActionResult> CreateAlert(GrowthAlert alert)
        {
            await _service.CreateAlertAsync(alert);
            return CreatedAtAction(nameof(GetAlertById), new { id = alert.Id }, alert);
        }

        // PUT: api/GrowthAlert/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAlert(int id, GrowthAlert alert)
        {
            if (id != alert.Id)
            {
                return BadRequest();
            }

            await _service.UpdateAlertAsync(alert);
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
