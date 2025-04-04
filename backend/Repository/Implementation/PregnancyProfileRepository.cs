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
            var profile = _mapper.Map<PregnancyProfile>(profileDto);
            profile.CreatedAt = DateTime.Now;
            
            // Calculate conception date based on due date and week of pregnancy
            // Standard pregnancy is 40 weeks, so we calculate backwards from the due date
            int daysToSubtract = (40 - profileDto.WeekOfPregnancy) * 7;
            profile.ConceptionDate = profileDto.DueDate.AddDays(-daysToSubtract);
            
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
                // Validate due date
                if (profileDto.DueDate.Value < DateTime.Now)
                    throw new ArgumentException("Due date cannot be in the past");
                    
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
            var profile = await _context.PregnancyProfiles.FindAsync(id);
            if (profile == null) return -1;

            _context.PregnancyProfiles.Remove(profile);
            return await _context.SaveChangesAsync();
        }
    }
}