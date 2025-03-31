using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using backend.Dtos.GrowthAlerts;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Services.Implementation
{
    public class GrowthAlertService : IGrowthAlertService
    {
        private readonly IGrowthAlertRepository _repository;
        private readonly ApplicationDBContext _context;

        public GrowthAlertService(IGrowthAlertRepository repository, ApplicationDBContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAllAlertsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<GrowthAlertDto> GetAlertByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAlertsByMeasurementIdAsync(int measurementId)
        {
            return await _repository.GetByMeasurementIdAsync(measurementId);
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAlertsByUserIdAsync(int userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAlertsByUserIdWithWeekAsync(int userId)
        {
            return await _repository.GetByUserIdWithWeekAsync(userId);
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAlertsByProfileIdAsync(int profileId)
        {
            return await _repository.GetByProfileIdAsync(profileId);
        }

        public async Task CreateAlertAsync(GrowthAlert alert)
        {
            await _repository.AddAsync(alert);
        }

        public async Task UpdateAlertAsync(int id, UpdateGrowthAlertDto alertDto)
        {
            // Get the entity directly from the context
            var alert = await _context.GrowthAlerts.FindAsync(id);
            if (alert == null)
            {
                throw new KeyNotFoundException($"GrowthAlert with ID {id} not found");
            }
            
            // Update the property
            alert.AlertMessage = alertDto.AlertMessage;
            
            // Pass the updated entity to the repository
            await _repository.UpdateAsync(alert);
        }

        public async Task DeleteAlertAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
