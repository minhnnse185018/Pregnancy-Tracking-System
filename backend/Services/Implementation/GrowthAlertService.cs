using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using backend.Dtos.GrowthAlerts;

namespace backend.Services.Implementation
{
    public class GrowthAlertService : IGrowthAlertService
    {
        private readonly IGrowthAlertRepository _repository;

        public GrowthAlertService(IGrowthAlertRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<GrowthAlert>> GetAllAlertsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<GrowthAlert> GetAlertByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<GrowthAlert>> GetAlertsByMeasurementIdAsync(int measurementId)
        {
            return await _repository.GetByMeasurementIdAsync(measurementId);
        }

        public async Task<IEnumerable<GrowthAlert>> GetAlertsByUserIdAsync(int userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAlertsByUserIdWithWeekAsync(int userId)
        {
            return await _repository.GetByUserIdWithWeekAsync(userId);
        }

        public async Task CreateAlertAsync(GrowthAlert alert)
        {
            await _repository.AddAsync(alert);
        }

        public async Task UpdateAlertAsync(GrowthAlert alert)
        {
            await _repository.UpdateAsync(alert);
        }

        public async Task DeleteAlertAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
