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

        [HttpGet("GetAllProfiles")]
        public async Task<IActionResult> GetAllProfiles()
        {
            var profiles = await _profileRepository.GetAllProfilesAsync();
            return Ok(profiles);
        }

        [HttpGet("GetProfileById/{id}")]
        public async Task<IActionResult> GetProfileById(int id)
        {
            var profile = await _profileRepository.GetProfileByIdAsync(id);
            return profile == null ? NotFound() : Ok(profile);
        }

        [HttpGet("GetProfilesByUserId/{userId}")]
        public async Task<IActionResult> GetProfilesByUserId(int userId)
        {
            var profiles = await _profileRepository.GetProfilesByUserIdAsync(userId);
            return Ok(profiles);
        }

        [HttpPost("CreateProfile")]
        public async Task<IActionResult> CreateProfile([FromBody] CreatePregnancyProfileDto profileDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _profileRepository.CreateProfileAsync(profileDto);
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpPut("UpdateProfile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdatePregnancyProfileDto profileDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try 
            {
                var profile = await _profileRepository.UpdateProfileAsync(id, profileDto);
                if (profile == null)
                    return NotFound($"No pregnancy profile found with ID {id}");
            
                return Ok(profile);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while updating the profile");
            }
        }

        [HttpDelete("DeleteProfile/{id}")]
        public async Task<IActionResult> DeleteProfile(int id)
        {
            var result = await _profileRepository.DeleteProfileAsync(id);
            return result > 0 ? Ok() : NotFound();
        }
    }
} 