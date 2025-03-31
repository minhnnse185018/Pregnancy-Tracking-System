using backend.Data;
using backend.Models;
using backend.Repository.Interface;
using backend.Dtos.GrowthAlerts;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class GrowthAlertRepository : IGrowthAlertRepository
    {
        private readonly ApplicationDBContext _context;

        public GrowthAlertRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetAllAsync()
        {
            return await _context.GrowthAlerts
                .Include(g => g.FetalMeasurement)
                .ThenInclude(f => f.Profile)
                .Select(g => new GrowthAlertDto
                {
                    Id = g.Id,
                    MeasurementId = g.MeasurementId,
                    AlertMessage = g.AlertMessage,
                    CreatedAt = g.CreatedAt,
                    Week = g.FetalMeasurement.Week,
                    ProfileId = g.FetalMeasurement.ProfileId,
                    ProfileName = g.FetalMeasurement.Profile.Name
                })
                .ToListAsync();
        }

        public async Task<GrowthAlertDto> GetByIdAsync(int id)
        {
            return await _context.GrowthAlerts
                .Include(g => g.FetalMeasurement)
                .ThenInclude(f => f.Profile)
                .Where(g => g.Id == id)
                .Select(g => new GrowthAlertDto
                {
                    Id = g.Id,
                    MeasurementId = g.MeasurementId,
                    AlertMessage = g.AlertMessage,
                    CreatedAt = g.CreatedAt,
                    Week = g.FetalMeasurement.Week,
                    ProfileId = g.FetalMeasurement.ProfileId,
                    ProfileName = g.FetalMeasurement.Profile.Name
                })
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetByMeasurementIdAsync(int measurementId)
        {
            return await _context.GrowthAlerts
                .Include(g => g.FetalMeasurement)
                .ThenInclude(f => f.Profile)
                .Where(g => g.MeasurementId == measurementId)
                .Select(g => new GrowthAlertDto
                {
                    Id = g.Id,
                    MeasurementId = g.MeasurementId,
                    AlertMessage = g.AlertMessage,
                    CreatedAt = g.CreatedAt,
                    Week = g.FetalMeasurement.Week,
                    ProfileId = g.FetalMeasurement.ProfileId,
                    ProfileName = g.FetalMeasurement.Profile.Name
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetByUserIdAsync(int userId)
        {
            return await _context.GrowthAlerts
                .Include(g => g.FetalMeasurement)
                .ThenInclude(f => f.Profile)
                .Where(g => g.FetalMeasurement.Profile.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new GrowthAlertDto
                {
                    Id = g.Id,
                    MeasurementId = g.MeasurementId,
                    AlertMessage = g.AlertMessage,
                    CreatedAt = g.CreatedAt,
                    Week = g.FetalMeasurement.Week,
                    ProfileId = g.FetalMeasurement.ProfileId,
                    ProfileName = g.FetalMeasurement.Profile.Name
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetByUserIdWithWeekAsync(int userId)
        {
            return await _context.GrowthAlerts
                .Include(g => g.FetalMeasurement)
                .ThenInclude(f => f.Profile)
                .Where(g => g.FetalMeasurement.Profile.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new GrowthAlertDto
                {
                    Id = g.Id,
                    MeasurementId = g.MeasurementId,
                    AlertMessage = g.AlertMessage,
                    CreatedAt = g.CreatedAt,
                    Week = g.FetalMeasurement.Week,
                    ProfileId = g.FetalMeasurement.ProfileId,
                    ProfileName = g.FetalMeasurement.Profile.Name
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<GrowthAlertDto>> GetByProfileIdAsync(int profileId)
        {
            return await _context.GrowthAlerts
                .Include(g => g.FetalMeasurement)
                .ThenInclude(f => f.Profile)
                .Where(g => g.FetalMeasurement.ProfileId == profileId)
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new GrowthAlertDto
                {
                    Id = g.Id,
                    MeasurementId = g.MeasurementId,
                    AlertMessage = g.AlertMessage,
                    CreatedAt = g.CreatedAt,
                    Week = g.FetalMeasurement.Week,
                    ProfileId = g.FetalMeasurement.ProfileId,
                    ProfileName = g.FetalMeasurement.Profile.Name
                })
                .ToListAsync();
        }

        public async Task AddAsync(GrowthAlert alert)
        {
            await _context.GrowthAlerts.AddAsync(alert);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(GrowthAlert alert)
        {
            _context.GrowthAlerts.Update(alert);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var alert = await _context.GrowthAlerts.FindAsync(id);
            if (alert != null)
            {
                _context.GrowthAlerts.Remove(alert);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateByIdAsync(int id, string alertMessage)
        {
            var alert = await _context.GrowthAlerts.FindAsync(id);
            if (alert != null)
            {
                alert.AlertMessage = alertMessage;
                _context.GrowthAlerts.Update(alert);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException($"GrowthAlert with ID {id} not found");
            }
        }
    }
}
