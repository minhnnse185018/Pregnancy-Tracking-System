using backend.Dtos.FetalGrowth;
using backend.Dtos.FetalStandard;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FetalGrowthStandardController : ControllerBase
    {
        private readonly IFetalGrowthStandardRepository _standardRepository;

        public FetalGrowthStandardController(IFetalGrowthStandardRepository standardRepository)
        {
            _standardRepository = standardRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStandards()
        {
            var standards = await _standardRepository.GetAllStandardsAsync();
            return Ok(standards);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStandardById(int id)
        {
            var standard = await _standardRepository.GetStandardByIdAsync(id);
            return standard == null ? NotFound() : Ok(standard);
        }

        [HttpGet("week/{week}")]
        public async Task<IActionResult> GetStandardsByWeek(int week)
        {
            var standards = await _standardRepository.GetStandardsByWeekAsync(week);
            return Ok(standards);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStandard([FromBody] CreateFetalGrowthStandardDto standardDto)
        {
            var standard = await _standardRepository.CreateStandardAsync(standardDto);
            return CreatedAtAction(nameof(GetStandardById), new { id = standard.Id }, standard);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStandard(int id, [FromBody] UpdateFetalGrowthStandardDto standardDto)
        {
            var standard = await _standardRepository.UpdateStandardAsync(id, standardDto);
            return standard == null ? NotFound() : Ok(standard);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStandard(int id)
        {
            var result = await _standardRepository.DeleteStandardAsync(id);
            return result ? Ok() : NotFound();
        }
    }
} 