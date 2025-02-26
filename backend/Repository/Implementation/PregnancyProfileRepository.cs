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

        public async Task<PregnancyProfileDto?> GetProfileByUserIdAsync(int userId)
        {
            var profile = await _context.PregnancyProfiles
                .Include(p => p.User)
                .Include(p => p.FetalMeasurements)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            return profile == null ? null : _mapper.Map<PregnancyProfileDto>(profile);
        }

        public async Task<PregnancyProfileDto?> GetProfileByIdAsync(int id)
        {
            var profile = await _context.PregnancyProfiles
                .Include(p => p.User)
                .Include(p => p.FetalMeasurements)
                .FirstOrDefaultAsync(p => p.Id == id);

            return profile == null ? null : _mapper.Map<PregnancyProfileDto>(profile);
        }

        public async Task<PregnancyProfileDto> CreateProfileAsync(int userId, CreatePregnancyProfileDto profileDto)
        {
            var profile = _mapper.Map<PregnancyProfile>(profileDto);
            profile.UserId = userId;
            profile.CreatedAt = DateTime.Now;

            _context.PregnancyProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return await GetProfileByIdAsync(profile.Id);
        }

        public async Task<PregnancyProfileDto?> UpdateProfileAsync(int id, UpdatePregnancyProfileDto profileDto)
        {
            var profile = await _context.PregnancyProfiles.FindAsync(id);
            if (profile == null) return null;

            _mapper.Map(profileDto, profile);
            await _context.SaveChangesAsync();

            return await GetProfileByIdAsync(id);
        }

        public async Task<int> DeleteProfileAsync(int id)
        {
            var profile = await _context.PregnancyProfiles.FindAsync(id);
            if (profile == null) return -1;

            _context.PregnancyProfiles.Remove(profile);
            
            return await _context.SaveChangesAsync();;
        }

        public async Task<List<PregnancyProfileDto>?> GetAllProfileAsync()
        {
            
                var profiles = await _context.PregnancyProfiles
                    .Include(p => p.User)  // Include User to get FirstName and LastName
                    .Include(p => p.FetalMeasurements)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return _mapper.Map<List<PregnancyProfileDto>>(profiles);
            
            
        }
    }
} 