using backend.Dtos.Memberships;
using backend.Repository.Interface;
using backend.Services.Implementation;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembershipController : ControllerBase
    {
        private readonly IMembershipService _membershipService;

        public MembershipController(IMembershipService membershipService)
        {
            _membershipService = membershipService;
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> CreatePendingMembership([FromBody] CreateMembershipDto membershipDto)
        {
            try
            {
                var membership = await _membershipService.CreatePendingMembershipAsync(membershipDto);
                return Ok(membership);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetMembershipsByUserId(int userId)
        {
            var memberships = await _membershipService.GetMembershipsByUserIdAsync(userId);
            return Ok(memberships);
        }

        [HttpGet("user/{userId}/active")]
        public async Task<IActionResult> CheckActiveMembership(int userId)
        {
            var isActive = await _membershipService.IsMembershipActiveAsync(userId);
            return Ok(new { IsActive = isActive });
        }

        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeMembership([FromBody] UpgradeMembershipDto upgradeDto)
        {
            try
            {
                var membership = await _membershipService.UpgradeMembershipAsync(upgradeDto.UserId, upgradeDto.NewPlanId);
                return Ok(new { Membership = membership, Message = "Please proceed to payment to activate the new plan." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
} 