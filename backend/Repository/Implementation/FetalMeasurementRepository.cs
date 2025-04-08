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
            // First get the pregnancy profile to check conception date
            var profile = await _context.PregnancyProfiles
                .FirstOrDefaultAsync(p => p.Id == measurementDto.ProfileId);
            
            if (profile == null)
            {
                throw new ArgumentException("Profile not found");
            }

            // Calculate current week of pregnancy
            int currentWeek = (int)Math.Floor((DateTime.Now - profile.ConceptionDate).TotalDays / 7);

            // Validate that the measurement week doesn't exceed current pregnancy week
            if (measurementDto.Week > currentWeek)
            {
                throw new ArgumentException($"Measurement week cannot exceed current pregnancy week ({currentWeek})");
            }

            var measurement = _mapper.Map<FetalMeasurement>(measurementDto);
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
            try
            {
                // Get the growth standard for this week
                var standard = await _context.FetalGrowthStandards
                    .FirstOrDefaultAsync(s => s.WeekNumber == measurement.Week);
                
                if (standard == null) return;

                // Prevent division by zero
                if (standard.WeightGrams <= 0 || standard.HeightCm <= 0) return;

                // Calculate standard deviations (15% of mean)
                decimal weightSD = standard.WeightGrams * 0.15m;
                decimal heightSD = standard.HeightCm * 0.15m;
                decimal bpdSD = standard.BiparietalDiameterCm * 0.15m;
                decimal flSD = standard.FemoralLengthCm * 0.15m;
                decimal hcSD = standard.HeadCircumferenceCm * 0.15m;
                decimal acSD = standard.AbdominalCircumferenceCm * 0.15m;

                // Build alert message
                string alertMessage = "";
                bool hasAbnormalMeasurement = false;

                // Check weight
                if (measurement.WeightGrams > 0)
                {
                    decimal weightZScore = (measurement.WeightGrams - standard.WeightGrams) / weightSD;
                    if (Math.Abs((double)weightZScore) > 2)
                    {
                        alertMessage += $"Weight: {measurement.WeightGrams}g is {(weightZScore > 0 ? "above" : "below")} normal range. ";
                        hasAbnormalMeasurement = true;
                    }
                }

                // Check height
                if (measurement.HeightCm > 0)
                {
                    decimal heightZScore = (measurement.HeightCm - standard.HeightCm) / heightSD;
                    if (Math.Abs((double)heightZScore) > 2)
                    {
                        alertMessage += $"Height: {measurement.HeightCm}cm is {(heightZScore > 0 ? "above" : "below")} normal range. ";
                        hasAbnormalMeasurement = true;
                    }
                }

                // Check BPD
                if (measurement.BiparietalDiameterCm.HasValue && measurement.BiparietalDiameterCm.Value > 0)
                {
                    decimal bpdZScore = (measurement.BiparietalDiameterCm.Value - standard.BiparietalDiameterCm) / bpdSD;
                    if (Math.Abs((double)bpdZScore) > 2)
                    {
                        alertMessage += $"Biparietal diameter: {measurement.BiparietalDiameterCm.Value}cm is {(bpdZScore > 0 ? "above" : "below")} normal range. ";
                        hasAbnormalMeasurement = true;
                    }
                }

                // Check Femoral Length
                if (measurement.FemoralLengthCm.HasValue && measurement.FemoralLengthCm.Value > 0)
                {
                    decimal flZScore = (measurement.FemoralLengthCm.Value - standard.FemoralLengthCm) / flSD;
                    if (Math.Abs((double)flZScore) > 2)
                    {
                        alertMessage += $"Femoral length: {measurement.FemoralLengthCm.Value}cm is {(flZScore > 0 ? "above" : "below")} normal range. ";
                        hasAbnormalMeasurement = true;
                    }
                }

                // Check Head Circumference
                if (measurement.HeadCircumferenceCm.HasValue && measurement.HeadCircumferenceCm.Value > 0)
                {
                    decimal hcZScore = (measurement.HeadCircumferenceCm.Value - standard.HeadCircumferenceCm) / hcSD;
                    if (Math.Abs((double)hcZScore) > 2)
                    {
                        string condition = hcZScore > 0 ? "Macrocephaly" : "Microcephaly";
                        alertMessage += $"Head circumference: {measurement.HeadCircumferenceCm.Value}cm indicates possible {condition}. ";
                        hasAbnormalMeasurement = true;
                    }
                }

                // Check Abdominal Circumference
                if (measurement.AbdominalCircumferenceCm.HasValue && measurement.AbdominalCircumferenceCm.Value > 0)
                {
                    decimal acZScore = (measurement.AbdominalCircumferenceCm.Value - standard.AbdominalCircumferenceCm) / acSD;
                    if (Math.Abs((double)acZScore) > 2)
                    {
                        string condition = acZScore > 0 ? "possible macrosomia" : "possible growth restriction";
                        alertMessage += $"Abdominal circumference: {measurement.AbdominalCircumferenceCm.Value}cm indicates {condition}. ";
                        hasAbnormalMeasurement = true;
                    }
                }

                // Create alert if any measurements were abnormal
                if (hasAbnormalMeasurement)
                {
                    var alert = new GrowthAlert
                    {
                        MeasurementId = measurement.Id,
                        AlertMessage = $"Week {measurement.Week} measurements show: {alertMessage.TrimEnd()}",
                        CreatedAt = DateTime.Now
                    };

                    await _context.GrowthAlerts.AddAsync(alert);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't throw - we don't want to fail the measurement creation
                Console.WriteLine($"Error generating growth alert: {ex.Message}");
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
        
        // Categorize growth based on percentile value in English
        private string CategorizeGrowth(double percentile)
        {
            if (percentile < 10)
                return "IUGR (Intrauterine Growth Restriction)";
            else if (percentile > 90)
                return "Macrosomia (Large Baby)";
            else
                return "Normal";
        }

        public async Task<FetalMeasurementDto?> UpdateMeasurementAsync(int id, UpdateFetalMeasurementDto measurementDto)
        {
            var measurement = await _context.FetalMeasurements
                .Include(f => f.Profile)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (measurement == null) return null;

            // Calculate current week of pregnancy
            int currentWeek = (int)Math.Floor((DateTime.Now - measurement.Profile.ConceptionDate).TotalDays / 7);

            // Validate that the measurement week doesn't exceed current pregnancy week
            if (measurementDto.Week > currentWeek)
            {
                throw new ArgumentException($"Measurement week cannot exceed current pregnancy week ({currentWeek})");
            }

            // Delete existing alerts for this measurement
            var existingAlerts = await _context.GrowthAlerts
                .Where(a => a.MeasurementId == id)
                .ToListAsync();
            
            if (existingAlerts.Any())
            {
                _context.GrowthAlerts.RemoveRange(existingAlerts);
                await _context.SaveChangesAsync();
            }

            _mapper.Map(measurementDto, measurement);

            // Save measurement updates
            await _context.SaveChangesAsync();

            // Generate new growth alerts if needed
            await GenerateGrowthAlertIfNeeded(measurement);

            return await GetMeasurementByIdAsync(id);
        }

        public async Task<int> DeleteMeasurementAsync(int id)
        {
            var measurement = await _context.FetalMeasurements.FindAsync(id);
            if (measurement == null) return -1;

            // Xóa các cảnh báo tăng trưởng liên quan trước
            var alerts = await _context.GrowthAlerts
                .Where(a => a.MeasurementId == id)
                .ToListAsync();
            
            if (alerts.Any())
            {
                _context.GrowthAlerts.RemoveRange(alerts);
            }

            // Sau đó xóa phép đo
            _context.FetalMeasurements.Remove(measurement);
            
            return await _context.SaveChangesAsync();
        }

        // New helper method to categorize BPD based on Z-score
        private string CategorizeBPD(decimal zScore)
        {
            double absZScore = Math.Abs((double)zScore);
            
            if (absZScore > 2)
            {
                return zScore > 0 ? "Abnormally Large" : "Abnormally Small";
            }
            else
            {
                return "Normal";
            }
        }

        // Helper method to categorize measurements based on Z-score
        private string CategorizeByZScore(decimal zScore)
        {
            double absZScore = Math.Abs((double)zScore);
            
            if (absZScore > 2)
            {
                return zScore > 0 ? "Abnormally Large" : "Abnormally Small";
            }
            else
            {
                return "Normal";
            }
        }

        // Helper method to categorize femoral length (FL) measurements
        private string CategorizeFemoralLength(decimal flZScore, decimal flMeasurement, decimal standardFL)
        {
            // Calculate the threshold limits based on Z-score approach
            decimal lowerLimit = standardFL - (2 * standardFL * 0.15m); // FLtrung bình - (2 × SD)
            decimal upperLimit = standardFL + (2 * standardFL * 0.15m); // FLtrung bình + (2 × SD)
            
            if (flMeasurement < lowerLimit)
                return "Growth restriction or bone abnormality";
            else if (flMeasurement > upperLimit)
                return "Larger than gestational age or genetic factors";
            else
                return "Normal";
        }

        // Helper method to categorize head circumference (HC) measurements
        private string CategorizeHeadCircumference(decimal hcMeasurement, decimal standardHC, decimal sdHC)
        {
            // Calculate the threshold limits based on the provided formula
            decimal lowerLimit = standardHC - (2 * sdHC); // HCtrung bình - (2 × SD)
            decimal upperLimit = standardHC + (2 * sdHC); // HCtrung bình + (2 × SD)
            
            if (hcMeasurement < lowerLimit)
                return "Microcephaly";
            else if (hcMeasurement > upperLimit)
                return "Macrocephaly or larger than gestational age";
            else
                return "Normal";
        }

        // Helper method to categorize abdominal circumference (AC) measurements
        private string CategorizeAbdominalCircumference(decimal acMeasurement, decimal standardAC, decimal sdAC)
        {
            // Calculate the threshold limits based on the provided formula
            decimal lowerLimit = standardAC - (2 * sdAC); // ACtrung bình - (2 × SD)
            decimal upperLimit = standardAC + (2 * sdAC); // ACtrung bình + (2 × SD)
            
            if (acMeasurement < lowerLimit)
                return "Intrauterine Growth Restriction (IUGR)";
            else if (acMeasurement > upperLimit)
                return "Macrosomia or polyhydramnios";
            else
                return "Normal";
        }
    }
}