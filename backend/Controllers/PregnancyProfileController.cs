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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfileById(int id)
        {
            var profile = await _profileRepository.GetProfileByIdAsync(id);
            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetProfileByUserId(int userId)
        {
            var profile = await _profileRepository.GetProfileByUserIdAsync(userId);
            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] CreatePregnancyProfileDto profileDto)
        {
            // TODO: Get userId from token
            int userId = 1; // Temporary
            var profile = await _profileRepository.CreateProfileAsync(userId, profileDto);
            return CreatedAtAction(nameof(GetProfileById), new { id = profile.Id }, profile);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdatePregnancyProfileDto profileDto)
        {
            var profile = await _profileRepository.UpdateProfileAsync(id, profileDto);
            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(int id)
        {
            var result = await _profileRepository.DeleteProfileAsync(id);
            return result ? Ok() : NotFound();
        }
    }
} 