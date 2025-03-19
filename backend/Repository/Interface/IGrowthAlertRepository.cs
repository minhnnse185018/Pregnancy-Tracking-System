using backend.Models;
using backend.Dtos.GrowthAlerts;

namespace backend.Repository.Interface
{
    public interface IGrowthAlertRepository
    {
        Task<IEnumerable<GrowthAlertDto>> GetAllAsync();
        Task<GrowthAlertDto> GetByIdAsync(int id);
        Task<GrowthAlertDto> GetByMeasurementIdAsync(int measurementId);
        Task<IEnumerable<GrowthAlertDto>> GetByUserIdAsync(int userId);
        Task AddAsync(GrowthAlert alert);
        Task UpdateAsync(GrowthAlert alert);
        Task DeleteAsync(int id);
        Task<List<GrowthAlertDto>> GetGrowthAlertsByProfileId(int profileId);
    }
}
