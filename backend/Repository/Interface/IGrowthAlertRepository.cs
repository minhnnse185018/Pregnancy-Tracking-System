using backend.Models;
using backend.Dtos.GrowthAlerts;

namespace backend.Repository.Interface
{
    public interface IGrowthAlertRepository
    {
        Task<IEnumerable<GrowthAlert>> GetAllAsync();
        Task<GrowthAlert> GetByIdAsync(int id);
        Task<IEnumerable<GrowthAlert>> GetByMeasurementIdAsync(int measurementId);
        Task<IEnumerable<GrowthAlert>> GetByUserIdAsync(int userId);
        Task<IEnumerable<GrowthAlertDto>> GetByUserIdWithWeekAsync(int userId);
        Task AddAsync(GrowthAlert alert);
        Task UpdateAsync(GrowthAlert alert);
        Task DeleteAsync(int id);
    }
}
