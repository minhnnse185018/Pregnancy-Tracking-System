using backend.Dtos.PregnancyProfiles;

namespace backend.Repository.Interface
{
    public interface IPregnancyProfileRepository
    {
        Task<List<PregnancyProfileDto>> GetAllProfilesAsync();
        Task<PregnancyProfileDto?> GetProfileByIdAsync(int id);
        Task<List<PregnancyProfileDto>> GetProfilesByUserIdAsync(int userId);
        Task<int> CreateProfileAsync(CreatePregnancyProfileDto profileDto);
        Task<PregnancyProfileDto?> UpdateProfileAsync(int id, UpdatePregnancyProfileDto profileDto);
        Task<int> DeleteProfileAsync(int id);
    }
} 