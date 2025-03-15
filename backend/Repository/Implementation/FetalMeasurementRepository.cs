using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Models;
using backend.Dtos.FetalGrowth;
using backend.Data;
using backend.Repository.Interface;

namespace backend.Repository.Implementation
{
    public class FetalMeasurementRepository : IFetalMeasurementRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public FetalMeasurementRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<FetalMeasurementDto>> GetAllMeasurementsAsync()
        {
            var measurements = await _context.FetalMeasurements
                .Include(f => f.Profile)
                .OrderBy(f => f.Week) // Changed from MeasurementDate to CreatedAt
                .ToListAsync();

            return _mapper.Map<List<FetalMeasurementDto>>(measurements);
        }

        public async Task<FetalMeasurementDto?> GetMeasurementByIdAsync(int id)
        {
            var measurement = await _context.FetalMeasurements
                .Include(f => f.Profile)
                .FirstOrDefaultAsync(f => f.Id == id);

            return measurement == null ? null : _mapper.Map<FetalMeasurementDto>(measurement);
        }

        public async Task<List<FetalMeasurementDto>> GetMeasurementsByProfileIdAsync(int profileId)
        {
            var measurements = await _context.FetalMeasurements
                .Include(f => f.Profile)
                .Where(f => f.ProfileId == profileId)
                .OrderByDescending(f => f.Week) // Changed from MeasurementDate to Week
                .ToListAsync();

            return _mapper.Map<List<FetalMeasurementDto>>(measurements);
        }

        public async Task<FetalMeasurementDto> CreateMeasurementAsync(CreateFetalMeasurementDto measurementDto)
        {
            var measurement = _mapper.Map<FetalMeasurement>(measurementDto);
            
            // No need to load profile to calculate week
            // Week is now directly set in the DTO
            measurement.CreatedAt = DateTime.Now;

            await _context.FetalMeasurements.AddAsync(measurement);
            await _context.SaveChangesAsync();

            // Generate growth alert if the measurement is outside normal range
            await GenerateGrowthAlertIfNeeded(measurement);

            return await GetMeasurementByIdAsync(measurement.Id);
        }

        // Enhanced method to check growth standards and create alerts using percentiles
        private async Task GenerateGrowthAlertIfNeeded(FetalMeasurement measurement)
        {
            // Get the growth standard for this week
            var standard = await _context.FetalGrowthStandards
                .FirstOrDefaultAsync(s => s.WeekNumber == measurement.Week);
            
            if (standard != null)
            {
                // Standard deviation approximation (typically about 15% of the mean for fetal biometry)
                decimal weightSD = standard.WeightGrams * 0.15m;
                decimal heightSD = standard.HeightCm * 0.15m;
                
                // Calculate Z-scores
                decimal weightZScore = (measurement.WeightGrams - standard.WeightGrams) / weightSD;
                decimal heightZScore = (measurement.HeightCm - standard.HeightCm) / heightSD;
                
                // Calculate percentiles
                double weightPercentile = ZScoreToPercentile(Convert.ToDouble(weightZScore));
                double heightPercentile = ZScoreToPercentile(Convert.ToDouble(heightZScore));
                
                // Categorize growth based on percentiles
                string weightCategory = CategorizeGrowth(weightPercentile);
                string heightCategory = CategorizeGrowth(heightPercentile);
                
                // Only create alert if either weight or height is outside normal range
                if (weightCategory != "Bình thường" || heightCategory != "Bình thường")
                {
                    // Create alert message with percentile information in Vietnamese
                    string alertMessage = "Đánh giá phần trăm tăng trưởng: ";
                    
                    if (weightCategory != "Bình thường")
                    {
                        alertMessage += $"Cân nặng ở mức {weightPercentile:F1}% ({weightCategory}). ";
                    }
                    
                    if (heightCategory != "Bình thường")
                    {
                        alertMessage += $"Chiều cao ở mức {heightPercentile:F1}% ({heightCategory}).";
                    }
                    
                    var alert = new GrowthAlert
                    {
                        MeasurementId = measurement.Id,
                        AlertMessage = alertMessage,
                        CreatedAt = DateTime.Now
                    };
                    
                    await _context.GrowthAlerts.AddAsync(alert);
                    await _context.SaveChangesAsync();
                }
                // If both measurements are normal, don't create any alert (no action needed)
            }
        }
        
        // Helper method to convert Z-score to percentile
        private double ZScoreToPercentile(double zScore)
        {
            // Normal cumulative distribution function (CDF)
            double p = 0.5 * (1 + ErrorFunction(zScore / Math.Sqrt(2)));
            return p * 100; // Convert to percentage
        }
        
        // Error function approximation for calculating the normal CDF
        private double ErrorFunction(double x)
        {
            // Constants for the approximation
            double a = 0.140012;
            double sign = Math.Sign(x);
            x = Math.Abs(x);
            
            // Approximation formula
            double t = 1.0 / (1.0 + a * x);
            double erf = 1 - t * Math.Exp(-x * x - 1.26551223 + 
                         t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + 
                         t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + 
                         t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
            
            return sign * erf;
        }
        
        // Categorize growth based on percentile value with Vietnamese responses
        private string CategorizeGrowth(double percentile)
        {
            if (percentile < 10)
                return "IUGR (Thai chậm phát triển trong tử cung)";
            else if (percentile > 90)
                return "Thai to (Macrosomia)";
            else
                return "Bình thường";
        }

        public async Task<FetalMeasurementDto?> UpdateMeasurementAsync(int id, UpdateFetalMeasurementDto measurementDto)
        {
            var measurement = await _context.FetalMeasurements
                .Include(f => f.Profile)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (measurement == null) return null;

            _mapper.Map(measurementDto, measurement);
            // No need to call CalculateWeek

            await _context.SaveChangesAsync();
            return await GetMeasurementByIdAsync(id);
        }

        public async Task<int> DeleteMeasurementAsync(int id)
        {
            var measurement = await _context.FetalMeasurements.FindAsync(id);
            if (measurement == null) return -1;

            _context.FetalMeasurements.Remove(measurement);
            return await _context.SaveChangesAsync();
        }
    }
}