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

        public async Task AddAsync(GrowthAlert alert)
        {
            await _repository.AddAsync(alert);
        }

        public async Task DeleteAsync(int id)
        {
            _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<GrowthAlertDto> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<GrowthAlertDto> GetByMeasurementIdAsync(int measurementId)
        {
            return await _repository.GetByMeasurementIdAsync(measurementId);
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetByUserIdAsync(int userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<List<GrowthAlertDto>> GetGrowthAlertsByProfileId(int profileId)
        {
            return await _repository.GetGrowthAlertsByProfileId(profileId);
        }

        public async Task UpdateAsync(GrowthAlert alert)
        {
            await _repository.UpdateAsync(alert);
        }
    }
}
