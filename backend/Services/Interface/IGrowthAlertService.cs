using backend.Models;
using backend.Dtos.GrowthAlerts;

namespace backend.Services.Interface
{
    public interface IGrowthAlertService
    {
        Task<IEnumerable<GrowthAlertDto>> GetAllAlertsAsync();
        Task<GrowthAlertDto> GetAlertByIdAsync(int id);
        Task<IEnumerable<GrowthAlertDto>> GetAlertsByMeasurementIdAsync(int measurementId);
        Task<IEnumerable<GrowthAlertDto>> GetAlertsByUserIdAsync(int userId);
        Task<IEnumerable<GrowthAlertDto>> GetAlertsByUserIdWithWeekAsync(int userId);
        Task<IEnumerable<GrowthAlertDto>> GetAlertsByProfileIdAsync(int profileId);
        Task CreateAlertAsync(GrowthAlert alert);
        Task UpdateAlertAsync(int id, UpdateGrowthAlertDto alertDto);
        Task DeleteAlertAsync(int id);
    }
}
