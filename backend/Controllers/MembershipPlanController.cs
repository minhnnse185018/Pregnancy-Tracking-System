using backend.Dtos.MembershipPlans;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembershipPlanController : ControllerBase
    {
        private readonly IMembershipPlanRepository _planRepository;

        public MembershipPlanController(IMembershipPlanRepository planRepository)
        {
            _planRepository = planRepository;
        }

        [HttpGet("GetAllPlans")]
        public async Task<IActionResult> GetAllPlans()
        {
            var plans = await _planRepository.GetAllPlansAsync();
            return Ok(plans);
        }

        [HttpGet("GetPlanById/{id}")]
        public async Task<IActionResult> GetPlanById(int id)
        {
            var plan = await _planRepository.GetPlanByIdAsync(id);
            return plan == null ? NotFound() : Ok(plan);
        }

        [HttpPost("CreatePlan")]
        public async Task<IActionResult> CreatePlan([FromBody] CreateMembershipPlanDto planDto)
        {
            var result = await _planRepository.CreatePlanAsync(planDto);
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpPut("UpdatePlan/{id}")]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] UpdateMembershipPlanDto planDto)
        {
            var plan = await _planRepository.UpdatePlanAsync(id, planDto);
            return plan == null ? NotFound() : Ok(plan);
        }

        [HttpDelete("DeletePlan/{id}")]
        public async Task<IActionResult> DeletePlan(int id)
        {
            var result = await _planRepository.DeletePlanAsync(id);
            return result > 0 ? Ok() : NotFound();
        }
    }
} 