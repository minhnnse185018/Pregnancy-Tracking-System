using AutoMapper;
using backend.Data;
using backend.Dtos.PregnancyProfiles;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class PregnancyProfileRepository : IPregnancyProfileRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public PregnancyProfileRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<PregnancyProfileDto>> GetAllProfilesAsync()
        {
            var profiles = await _context.PregnancyProfiles
                .Include(p => p.User)
                .Include(p => p.FetalMeasurements)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<PregnancyProfileDto>>(profiles);
        }

        public async Task<PregnancyProfileDto?> GetProfileByIdAsync(int id)
        {
            var profile = await _context.PregnancyProfiles
                .Include(p => p.User)
                .Include(p => p.FetalMeasurements)
                .FirstOrDefaultAsync(p => p.Id == id);

            return profile == null ? null : _mapper.Map<PregnancyProfileDto>(profile);
        }

        public async Task<List<PregnancyProfileDto>> GetProfilesByUserIdAsync(int userId)
        {
            var profiles = await _context.PregnancyProfiles
                .Include(p => p.User)
                .Include(p => p.FetalMeasurements)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<PregnancyProfileDto>>(profiles);
        }

        public async Task<int> CreateProfileAsync(CreatePregnancyProfileDto profileDto)
        {
            // Validate current pregnancy week input
            if (profileDto.WeekOfPregnancy < 0 || profileDto.WeekOfPregnancy > 42) // Weeks 0-42 are plausible inputs
            {
                throw new ArgumentException("Week of pregnancy must be between 0 and 42 weeks");
            }

            // Calculate expected due date range based on CURRENT week and today's date
            DateTime today = DateTime.Now.Date;
            // Calculate weeks remaining until week 37 (earliest full term) and week 42 (latest typical)
            int remainingWeeksToEarliest = Math.Max(0, 37 - profileDto.WeekOfPregnancy);
            int remainingWeeksToLatest = Math.Max(0, 42 - profileDto.WeekOfPregnancy);

            // Calculate the earliest and latest acceptable *estimated* due dates based on today
            DateTime earliestAcceptableDueDate = today.AddDays(remainingWeeksToEarliest * 7);
            DateTime latestAcceptableDueDate = today.AddDays(remainingWeeksToLatest * 7);

            // Validate if the provided estimated DueDate falls within the acceptable range based on current week
            if (profileDto.DueDate < earliestAcceptableDueDate || profileDto.DueDate > latestAcceptableDueDate)
            {
                // Make the error message clearer about what is being compared
                throw new ArgumentException($"Based on being {profileDto.WeekOfPregnancy} weeks pregnant today, the estimated Due Date should typically fall between {earliestAcceptableDueDate.ToShortDateString()} and {latestAcceptableDueDate.ToShortDateString()}. The provided Due Date {profileDto.DueDate.ToShortDateString()} is outside this range.");
            }
            // Also ensure the provided DueDate is in the future relative to today
            if (profileDto.DueDate <= today)
            {
                 throw new ArgumentException($"The estimated Due Date {profileDto.DueDate.ToShortDateString()} must be in the future.");
            }

            DateTime todayAgain = DateTime.Now.Date; // Get today's date again for calculation

            var profile = _mapper.Map<PregnancyProfile>(profileDto);
            profile.CreatedAt = DateTime.Now; // Record creation timestamp

            // --- REVISED Conception Date Calculation ---

            // 1. Calculate the estimated number of days remaining until the DueDate from today.
            TimeSpan remainingTime = profileDto.DueDate.Date - todayAgain;
            int remainingDays = (int)remainingTime.TotalDays;

            // 2. Calculate the total estimated gestation length in days.
            //    (Current Week * 7 days/week) + Remaining Days
            int currentDaysPregnant = profileDto.WeekOfPregnancy * 7;
            int totalEstimatedGestationDays = currentDaysPregnant + remainingDays;

            // 3. Calculate the estimated ConceptionDate by subtracting the
            //    total estimated gestation days from the DueDate.
            profile.ConceptionDate = profileDto.DueDate.AddDays(-totalEstimatedGestationDays);

            // --- End of Revised Calculation ---

            // Ensure calculated conception date is not in the future (sanity check)
            if (profile.ConceptionDate >= todayAgain) // Use >= for safety
            {
                // This check is still important as inputs could still lead to an issue
                throw new ArgumentException($"Calculated conception date ({profile.ConceptionDate.ToShortDateString()}) cannot be today or in the future based on the provided Due Date ({profileDto.DueDate.ToShortDateString()}) and current week ({profileDto.WeekOfPregnancy}). Please check your inputs.");
            }

            _context.PregnancyProfiles.Add(profile);
            return await _context.SaveChangesAsync();
        }

        public async Task<PregnancyProfileDto?> UpdateProfileAsync(int id, UpdatePregnancyProfileDto profileDto)
        {
            var profile = await _context.PregnancyProfiles
                .Include(p => p.User)
                .Include(p => p.FetalMeasurements)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (profile == null) return null;

            // Update properties based on what was provided
            if (!string.IsNullOrEmpty(profileDto.Name))
                profile.Name = profileDto.Name;
            
            if (profileDto.ConceptionDate.HasValue)
            {
                // Validate conception date
                if (profileDto.ConceptionDate.Value > DateTime.Now)
                    throw new ArgumentException("Conception date cannot be in the future");
                    
                profile.ConceptionDate = profileDto.ConceptionDate.Value;
            }
            
            if (profileDto.DueDate.HasValue)
            {
                
                
                    
                // Validation for due date should be approximately 40 weeks after conception
                if (profileDto.ConceptionDate.HasValue && 
                    (profileDto.DueDate.Value - profileDto.ConceptionDate.Value).TotalDays < 250 ||
                    (profileDto.DueDate.Value - profileDto.ConceptionDate.Value).TotalDays > 310)
                    throw new ArgumentException("Due date should be approximately 40 weeks (280 days) after conception date");
                    
                profile.DueDate = profileDto.DueDate.Value;
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<PregnancyProfileDto>(profile);
        }

        public async Task<int> DeleteProfileAsync(int id)
        {
            var profile = await _context.PregnancyProfiles
                .Include(p => p.FetalMeasurements)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (profile == null) return -1;

            // Explicitly remove associated fetal measurements first
            if (profile.FetalMeasurements != null && profile.FetalMeasurements.Any())
            {
                // Also remove any growth alerts associated with these measurements
                var measurementIds = profile.FetalMeasurements.Select(fm => fm.Id).ToList();
                var relatedAlerts = await _context.GrowthAlerts
                    .Where(ga => measurementIds.Contains(ga.MeasurementId))
                    .ToListAsync();
                if(relatedAlerts.Any())
                {
                    _context.GrowthAlerts.RemoveRange(relatedAlerts);
                }

                _context.FetalMeasurements.RemoveRange(profile.FetalMeasurements);
            }

            // Now remove the profile itself
            _context.PregnancyProfiles.Remove(profile);

            return await _context.SaveChangesAsync();
        }
    }
}