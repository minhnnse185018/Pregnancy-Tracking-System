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
                
                // Standard deviations for new measurements
                decimal bpdSD = standard.BiparietalDiameterCm * 0.15m;
                decimal flSD = standard.FemoralLengthCm * 0.15m;
                decimal hcSD = standard.HeadCircumferenceCm * 0.15m;
                decimal acSD = standard.AbdominalCircumferenceCm * 0.15m;
                
                // Calculate Z-scores
                decimal weightZScore = (measurement.WeightGrams - standard.WeightGrams) / weightSD;
                decimal heightZScore = (measurement.HeightCm - standard.HeightCm) / heightSD;
                
                // Z-scores for new measurements (only if measurement is provided)
                decimal? bpdZScore = measurement.BiparietalDiameterCm.HasValue ? 
                    (measurement.BiparietalDiameterCm.Value - standard.BiparietalDiameterCm) / bpdSD : null;
                decimal? flZScore = measurement.FemoralLengthCm.HasValue ?
                    (measurement.FemoralLengthCm.Value - standard.FemoralLengthCm) / flSD : null;
                decimal? hcZScore = measurement.HeadCircumferenceCm.HasValue ?
                    (measurement.HeadCircumferenceCm.Value - standard.HeadCircumferenceCm) / hcSD : null;
                decimal? acZScore = measurement.AbdominalCircumferenceCm.HasValue ?
                    (measurement.AbdominalCircumferenceCm.Value - standard.AbdominalCircumferenceCm) / acSD : null;
                
                // Calculate percentiles
                double weightPercentile = ZScoreToPercentile(Convert.ToDouble(weightZScore));
                double heightPercentile = ZScoreToPercentile(Convert.ToDouble(heightZScore));
                
                // Percentiles for new measurements
                double? bpdPercentile = bpdZScore.HasValue ? ZScoreToPercentile(Convert.ToDouble(bpdZScore.Value)) : null;
                double? flPercentile = flZScore.HasValue ? ZScoreToPercentile(Convert.ToDouble(flZScore.Value)) : null;
                double? hcPercentile = hcZScore.HasValue ? ZScoreToPercentile(Convert.ToDouble(hcZScore.Value)) : null;
                double? acPercentile = acZScore.HasValue ? ZScoreToPercentile(Convert.ToDouble(acZScore.Value)) : null;
                
                // Categorize measurements using English terms
                string bpdCategory = bpdZScore.HasValue ? CategorizeByZScore(bpdZScore.Value) : "Not Measured";
                
                // Categorize femur length by specific thresholds - convert to English
                string flCategory = "Not Measured";
                if (measurement.FemoralLengthCm.HasValue)
                {
                    // Calculate FL thresholds
                    decimal lowerLimit = standard.FemoralLengthCm - (2 * flSD);
                    decimal upperLimit = standard.FemoralLengthCm + (2 * flSD);
                    
                    if (measurement.FemoralLengthCm.Value < lowerLimit)
                        flCategory = "Growth restriction or bone abnormality";
                    else if (measurement.FemoralLengthCm.Value > upperLimit)
                        flCategory = "Larger than gestational age or genetic factors";
                    else
                        flCategory = "Normal";
                }
                
                // Categorize head circumference with English terminology
                string hcCategory = "Not Measured";
                if (measurement.HeadCircumferenceCm.HasValue)
                {
                    decimal lowerLimit = standard.HeadCircumferenceCm - (2 * hcSD);
                    decimal upperLimit = standard.HeadCircumferenceCm + (2 * hcSD);
                    
                    if (measurement.HeadCircumferenceCm.Value < lowerLimit)
                        hcCategory = "Microcephaly";
                    else if (measurement.HeadCircumferenceCm.Value > upperLimit)
                        hcCategory = "Macrocephaly or larger than gestational age";
                    else
                        hcCategory = "Normal";
                }
                
                // Categorize abdominal circumference with English terminology
                string acCategory = "Not Measured";
                if (measurement.AbdominalCircumferenceCm.HasValue)
                {
                    decimal lowerLimit = standard.AbdominalCircumferenceCm - (2 * acSD);
                    decimal upperLimit = standard.AbdominalCircumferenceCm + (2 * acSD);
                    
                    if (measurement.AbdominalCircumferenceCm.Value < lowerLimit)
                        acCategory = "Intrauterine Growth Restriction (IUGR)";
                    else if (measurement.AbdominalCircumferenceCm.Value > upperLimit)
                        acCategory = "Macrosomia or polyhydramnios";
                    else
                        acCategory = "Normal";
                }
                
                // Categorize other measurements
                string weightCategory = CategorizeByZScore(weightZScore);
                string heightCategory = CategorizeByZScore(heightZScore);
                
                // Check if any measurement is outside normal range
                bool hasAbnormalMeasurement = weightCategory != "Normal" || 
                                             heightCategory != "Normal" ||
                                             (bpdCategory != "Normal" && bpdCategory != "Not Measured") ||
                                             (flCategory != "Normal" && flCategory != "Not Measured") ||
                                             (hcCategory != "Normal" && hcCategory != "Not Measured") ||
                                             (acCategory != "Normal" && acCategory != "Not Measured");
                
                // Only create alert if any measurement is outside normal range
                if (hasAbnormalMeasurement)
                {
                    // Create alert message with percentile information in English
                    string alertMessage = "Growth assessment: ";
                    
                    if (weightCategory != "Normal")
                    {
                        alertMessage += $"Weight: {measurement.WeightGrams}g ({weightCategory}). ";
                    }
                    
                    if (heightCategory != "Normal")
                    {
                        alertMessage += $"Height: {measurement.HeightCm}cm ({heightCategory}). ";
                    }
                    
                    // Add alert message for BPD using Z-score criteria
                    if (bpdCategory != "Normal" && bpdCategory != "Not Measured")
                    {
                        alertMessage += $"Biparietal diameter (BPD): {measurement.BiparietalDiameterCm}cm, Z-score = {bpdZScore:F2} ({bpdCategory}). ";
                    }
                    
                    // Add alert message for FL using specific threshold criteria
                    if (flCategory != "Normal" && flCategory != "Not Measured")
                    {
                        decimal lowerLimit = standard.FemoralLengthCm - (2 * flSD);
                        decimal upperLimit = standard.FemoralLengthCm + (2 * flSD);
                        
                        alertMessage += $"Femur length (FL): {measurement.FemoralLengthCm}cm is outside normal range ({lowerLimit:F1}-{upperLimit:F1}cm). ";
                        alertMessage += $"Assessment: {flCategory}. ";
                    }
                    
                    // Add alert message for HC with specific diagnostic criteria
                    if (hcCategory != "Normal" && hcCategory != "Not Measured")
                    {
                        decimal lowerLimit = standard.HeadCircumferenceCm - (2 * hcSD);
                        decimal upperLimit = standard.HeadCircumferenceCm + (2 * hcSD);
                        
                        alertMessage += $"Head circumference (HC): {measurement.HeadCircumferenceCm}cm is outside normal range ({lowerLimit:F1}-{upperLimit:F1}cm). ";
                        alertMessage += $"Assessment: {hcCategory}. ";
                    }
                    
                    // Add alert message for AC with specific diagnostic criteria
                    if (acCategory != "Normal" && acCategory != "Not Measured")
                    {
                        decimal lowerLimit = standard.AbdominalCircumferenceCm - (2 * acSD);
                        decimal upperLimit = standard.AbdominalCircumferenceCm + (2 * acSD);
                        
                        alertMessage += $"Abdominal circumference (AC): {measurement.AbdominalCircumferenceCm}cm is outside normal range ({lowerLimit:F1}-{upperLimit:F1}cm). ";
                        alertMessage += $"Assessment: {acCategory}. ";
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
                // If all measurements are normal, don't create any alert (no action needed)
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