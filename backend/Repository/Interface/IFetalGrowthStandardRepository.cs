using backend.Dtos.FetalGrowth;
using backend.Dtos.FetalStandard;

namespace backend.Repository.Interface
{
    public interface IFetalGrowthStandardRepository
    {
        Task<List<FetalGrowthStandardDto>> GetAllStandardsAsync();
        Task<FetalGrowthStandardDto?> GetStandardByIdAsync(int id);
        Task<List<FetalGrowthStandardDto>> GetStandardsByWeekAsync(int week);
        Task<FetalGrowthStandardDto> CreateStandardAsync(CreateFetalGrowthStandardDto standardDto);
        Task<FetalGrowthStandardDto?> UpdateStandardAsync(int id, UpdateFetalGrowthStandardDto standardDto);
        Task<bool> DeleteStandardAsync(int id);
    }
} 