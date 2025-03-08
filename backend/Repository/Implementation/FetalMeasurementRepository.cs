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
                .OrderByDescending(f => f.MeasurementDate)
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
                .OrderByDescending(f => f.MeasurementDate)
                .ToListAsync();

            return _mapper.Map<List<FetalMeasurementDto>>(measurements);
        }

        public async Task<FetalMeasurementDto> CreateMeasurementAsync(CreateFetalMeasurementDto measurementDto)
        {
            var measurement = _mapper.Map<FetalMeasurement>(measurementDto);
            
            // Load profile to calculate week
            measurement.Profile = await _context.PregnancyProfiles.FindAsync(measurementDto.ProfileId);
            measurement.CalculateWeek();
            measurement.CreatedAt = DateTime.Now;

            await _context.FetalMeasurements.AddAsync(measurement);
            await _context.SaveChangesAsync();

            return await GetMeasurementByIdAsync(measurement.Id);
        }

        public async Task<FetalMeasurementDto?> UpdateMeasurementAsync(int id, UpdateFetalMeasurementDto measurementDto)
        {
            var measurement = await _context.FetalMeasurements
                .Include(f => f.Profile)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (measurement == null) return null;

            _mapper.Map(measurementDto, measurement);
            measurement.CalculateWeek();

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