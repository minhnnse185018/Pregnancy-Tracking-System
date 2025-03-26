using backend.Models;
using backend.Dtos.GrowthAlerts;

namespace backend.Services.Interface
{
    public interface IGrowthAlertService
    {
        Task<IEnumerable<GrowthAlert>> GetAllAlertsAsync();
        Task<GrowthAlert> GetAlertByIdAsync(int id);
        Task<IEnumerable<GrowthAlert>> GetAlertsByMeasurementIdAsync(int measurementId);
        Task<IEnumerable<GrowthAlert>> GetAlertsByUserIdAsync(int userId);
        Task<IEnumerable<GrowthAlertDto>> GetAlertsByUserIdWithWeekAsync(int userId);
        Task CreateAlertAsync(GrowthAlert alert);
        Task UpdateAlertAsync(GrowthAlert alert);
        Task DeleteAlertAsync(int id);
    }
}
