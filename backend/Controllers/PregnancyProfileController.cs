using backend.Dtos.PregnancyProfiles;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PregnancyProfileController : ControllerBase
    {
        private readonly IPregnancyProfileRepository _profileRepository;

        public PregnancyProfileController(IPregnancyProfileRepository profileRepository)
        {
            _profileRepository = profileRepository;
        }

        [HttpGet("GetProfileById/{id}")]
        public async Task<IActionResult> GetProfileById(int id)
        {
            var profile = await _profileRepository.GetProfileByIdAsync(id);
            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpGet("GetUserProfile/{userId}")]
        public async Task<IActionResult> GetProfileByUserId(int userId)
        {
            var profile = await _profileRepository.GetProfileByUserIdAsync(userId);
            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpPost("NewProfile")]
        public async Task<IActionResult> CreateProfile(int userId,[FromBody] CreatePregnancyProfileDto profileDto)
        {
            // TODO: Get userId from toke
            var profile = await _profileRepository.CreateProfileAsync(userId, profileDto);
            return Ok(profile);
        }

        [HttpPut("EditProfile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdatePregnancyProfileDto profileDto)
        {
            var profile = await _profileRepository.UpdateProfileAsync(id, profileDto);
            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpDelete("DeleteProfile/{id}")]
        public async Task<IActionResult> DeleteProfile(int id)
        {
            var result = await _profileRepository.DeleteProfileAsync(id);
            return result>0 ? Ok() : NotFound();
        }

        [HttpGet("GetAllProfile")]
        public async Task<IActionResult> GetAllProfiles()
        {
            var profiles = await _profileRepository.GetAllProfileAsync();
            return Ok(profiles);
        }
    }
} 