using backend.Models;
using backend.Dtos.GrowthAlerts;

namespace backend.Repository.Interface
{
    public interface IGrowthAlertRepository
    {
        Task<IEnumerable<GrowthAlertDto>> GetAllAsync();
        Task<GrowthAlertDto> GetByIdAsync(int id);
        Task<IEnumerable<GrowthAlertDto>> GetByMeasurementIdAsync(int measurementId);
        Task<IEnumerable<GrowthAlertDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<GrowthAlertDto>> GetByUserIdWithWeekAsync(int userId);
        Task<IEnumerable<GrowthAlertDto>> GetByProfileIdAsync(int profileId);
        Task AddAsync(GrowthAlert alert);
        Task UpdateAsync(GrowthAlert alert);
        Task UpdateByIdAsync(int id, string alertMessage);
        Task DeleteAsync(int id);
    }
}
