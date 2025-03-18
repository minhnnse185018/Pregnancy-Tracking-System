using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueService _revenueService;

        public RevenueController(IRevenueService revenueService)
        {
            _revenueService = revenueService;
        }

        // GET: api/Revenue/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetRevenueSummary([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            var summary = await _revenueService.GetRevenueSummaryAsync(startDate, endDate);
            return Ok(summary);
        }

        // GET: api/Revenue/daily?startDate=2023-01-01&endDate=2023-01-31
        [HttpGet("daily")]
        public async Task<IActionResult> GetDailyRevenue([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var dailyRevenue = await _revenueService.GetDailyRevenueAsync(startDate, endDate);
            return Ok(dailyRevenue);
        }

        // GET: api/Revenue/monthly/2023
        [HttpGet("monthly/{year}")]
        public async Task<IActionResult> GetMonthlyRevenue(int year)
        {
            var monthlyRevenue = await _revenueService.GetMonthlyRevenueAsync(year);
            return Ok(monthlyRevenue);
        }

        // GET: api/Revenue/by-plan
        [HttpGet("by-plan")]
        public async Task<IActionResult> GetRevenueByPlan([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            var planRevenue = await _revenueService.GetRevenueByPlanAsync(startDate, endDate);
            return Ok(planRevenue);
        }
    }
}
