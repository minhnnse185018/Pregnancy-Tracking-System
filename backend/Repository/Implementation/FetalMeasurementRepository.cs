using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using backend.Models;
using backend.Dtos.FetalGrowth;
using backend.Data;

namespace backend.Repository.Implementation
{
    public class FetalMeasurementRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public FetalMeasurementRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<FetalMeasurementDto> CreateMeasurementAsync(CreateFetalMeasurementDto dto)
        {
            var measurement = _mapper.Map<FetalMeasurement>(dto);
            
            // Load the profile to calculate week
            measurement.Profile = await _context.PregnancyProfiles.FindAsync(dto.ProfileId);
            measurement.CalculateWeek();

            _context.FetalMeasurements.Add(measurement);
            await _context.SaveChangesAsync();

            return _mapper.Map<FetalMeasurementDto>(measurement);
        }

        public async Task<FetalMeasurementDto?> UpdateMeasurementAsync(int id, UpdateFetalMeasurementDto dto)
        {
            var measurement = await _context.FetalMeasurements
                .Include(f => f.Profile)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (measurement == null) return null;

            _mapper.Map(dto, measurement);
            measurement.CalculateWeek();

            await _context.SaveChangesAsync();
            return _mapper.Map<FetalMeasurementDto>(measurement);
        }
    }
} 