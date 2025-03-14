using AutoMapper;
using backend.Data;
using backend.Dtos.FetalGrowth;
using backend.Dtos.FetalStandard;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class FetalGrowthStandardRepository : IFetalGrowthStandardRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public FetalGrowthStandardRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<FetalGrowthStandardDto>> GetAllStandardsAsync()
        {
            var standards = await _context.FetalGrowthStandards
                .OrderBy(s => s.WeekNumber)
                .ToListAsync();

            return _mapper.Map<List<FetalGrowthStandardDto>>(standards);
        }

        public async Task<FetalGrowthStandardDto?> GetStandardByIdAsync(int id)
        {
            var standard = await _context.FetalGrowthStandards
                .FirstOrDefaultAsync(s => s.Id == id);

            return standard == null ? null : _mapper.Map<FetalGrowthStandardDto>(standard);
        }

        public async Task<List<FetalGrowthStandardDto>> GetStandardsByWeekAsync(int week)
        {
            var standards = await _context.FetalGrowthStandards
                .Where(s => s.WeekNumber == week)
                .ToListAsync();

            return _mapper.Map<List<FetalGrowthStandardDto>>(standards);
        }

        public async Task<FetalGrowthStandardDto> CreateStandardAsync(CreateFetalGrowthStandardDto standardDto)
        {
            var standard = _mapper.Map<FetalGrowthStandard>(standardDto);

            _context.FetalGrowthStandards.Add(standard);
            await _context.SaveChangesAsync();

            return _mapper.Map<FetalGrowthStandardDto>(standard);
        }

        public async Task<FetalGrowthStandardDto?> UpdateStandardAsync(int id, UpdateFetalGrowthStandardDto standardDto)
        {
            var standard = await _context.FetalGrowthStandards.FindAsync(id);
            if (standard == null) return null;

            _mapper.Map(standardDto, standard);
            await _context.SaveChangesAsync();

            return _mapper.Map<FetalGrowthStandardDto>(standard);
        }

        public async Task<bool> DeleteStandardAsync(int id)
        {
            var standard = await _context.FetalGrowthStandards.FindAsync(id);
            if (standard == null) return false;

            _context.FetalGrowthStandards.Remove(standard);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}