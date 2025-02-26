using backend.Dtos.FetalGrowth;

namespace backend.Repository.Interface
{
    public interface IFetalMeasurementRepository
    {
        Task<List<FetalMeasurementDto>> GetAllMeasurementsAsync();
        Task<FetalMeasurementDto?> GetMeasurementByIdAsync(int id);
        Task<List<FetalMeasurementDto>> GetMeasurementsByProfileIdAsync(int profileId);
        Task<FetalMeasurementDto> CreateMeasurementAsync(CreateFetalMeasurementDto measurementDto);
        Task<FetalMeasurementDto?> UpdateMeasurementAsync(int id, UpdateFetalMeasurementDto measurementDto);
        Task<int> DeleteMeasurementAsync(int id);
    }
} 