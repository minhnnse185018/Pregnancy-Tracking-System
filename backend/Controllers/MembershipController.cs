using backend.Dtos.Memberships;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembershipController : ControllerBase
    {
        private readonly IMembershipRepository _membershipRepository;

        public MembershipController(IMembershipRepository membershipRepository)
        {
            _membershipRepository = membershipRepository;
        }

        [HttpGet("GetAllMemberShips")]
        public async Task<IActionResult> GetAllMemberships()
        {
            var memberships = await _membershipRepository.GetAllMembershipsAsync();
            return Ok(memberships);
        }

        [HttpGet("GetMBShipId/{id}")]
        public async Task<IActionResult> GetMembershipById(int id)
        {
            var membership = await _membershipRepository.GetMembershipByIdAsync(id);
            return membership == null ? NotFound() : Ok(membership);
        }

        [HttpGet("UserMBShips/{userId}")]
        public async Task<IActionResult> GetMembershipsByUserId(int userId)
        {
            var memberships = await _membershipRepository.GetMembershipsByUserIdAsync(userId);
            return Ok(memberships);
        }

        [HttpGet("UserActiveMBS/{userId}")]
        public async Task<IActionResult> CheckActiveMembership(int userId)
        {
            var isActive = await _membershipRepository.IsMembershipActiveAsync(userId);
            return Ok(new { isActive });
        }

        [HttpPost("CreateMBS")]
        public async Task<IActionResult> CreateMembership([FromBody] CreateMembershipDto membershipDto)
        {
            var result = await _membershipRepository.CreateMembershipAsync(membershipDto);
            return result>0?Ok():BadRequest();
        }

        [HttpPut("UpdateMBShip/{id}")]
        public async Task<IActionResult> UpdateMembership(int id,[FromBody] string Status )
        {
            var membership = await _membershipRepository.UpdateMembershipAsync(id, Status);
            return membership == null ? NotFound() : Ok(membership);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteMembership(int id)
        {
            var result = await _membershipRepository.DeleteMembershipAsync(id);
            return result >0? Ok() : NotFound();
        }
        [HttpPut("ExtendMemberShip/{id}")]
        public async Task<IActionResult> ExtendMembership([FromBody]int id )
        {
            var membership = await _membershipRepository.ExtendMemberShipAsync(id);
            return membership <0 ? NotFound() : Ok();
        }
    }
} 