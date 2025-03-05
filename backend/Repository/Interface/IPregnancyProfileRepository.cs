using backend.Dtos.PregnancyProfiles;

namespace backend.Repository.Interface
{
    public interface IPregnancyProfileRepository
    {
        Task<PregnancyProfileDto?> GetProfileByUserIdAsync(int userId);
        Task<PregnancyProfileDto?> GetProfileByIdAsync(int id);
        Task<PregnancyProfileDto> CreateProfileAsync(int userId, CreatePregnancyProfileDto profileDto);
        Task<PregnancyProfileDto?> UpdateProfileAsync(int id, UpdatePregnancyProfileDto profileDto);
        Task<bool> DeleteProfileAsync(int id);
    }
} 