using backend.Dtos.FetalGrowth;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FetalMeasurementController : ControllerBase
    {
        private readonly IFetalMeasurementRepository _measurementRepository;

        public FetalMeasurementController(IFetalMeasurementRepository measurementRepository)
        {
            _measurementRepository = measurementRepository;
        }

        [HttpGet("GetAllGrowth")]
        public async Task<IActionResult> GetAllMeasurements()
        {
            var measurements = await _measurementRepository.GetAllMeasurementsAsync();
            return Ok(measurements);
        }

        [HttpGet("GetGrowthById/{id}")]
        public async Task<IActionResult> GetMeasurementById(int id)
        {
            var measurement = await _measurementRepository.GetMeasurementByIdAsync(id);
            return measurement == null ? NotFound() : Ok(measurement);
        }

        [HttpGet("GetGrowthByProfile/{profileId}")]
        public async Task<IActionResult> GetMeasurementsByProfileId(int profileId)
        {
            var measurements = await _measurementRepository.GetMeasurementsByProfileIdAsync(profileId);
            return Ok(measurements);
        }

        [HttpPost("CreateGrowth")]
        public async Task<IActionResult> CreateMeasurement([FromBody] CreateFetalMeasurementDto measurementDto)
        {
            var measurement = await _measurementRepository.CreateMeasurementAsync(measurementDto);
            return Ok(measurement);
        }

        [HttpPut("UpdateGrowth/{id}")]
        public async Task<IActionResult> UpdateMeasurement(int id, [FromBody] UpdateFetalMeasurementDto measurementDto)
        {
            var measurement = await _measurementRepository.UpdateMeasurementAsync(id, measurementDto);
            return measurement == null ? NotFound() : Ok(measurement);
        }

        [HttpDelete("DeleteGrowth/{id}")]
        public async Task<IActionResult> DeleteMeasurement(int id)
        {
            var result = await _measurementRepository.DeleteMeasurementAsync(id);
            return result > 0 ? Ok() : NotFound();
        }
    }
} 