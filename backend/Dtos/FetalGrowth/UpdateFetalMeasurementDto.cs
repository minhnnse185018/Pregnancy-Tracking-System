using Newtonsoft.Json;
using backend.Helpers;

namespace backend.Dtos.FetalGrowth
{
    public class UpdateFetalMeasurementDto
    {
        public decimal? WeightGrams { get; set; }
        public decimal? HeightCm { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly? MeasurementDate { get; set; }
        
        public string? Notes { get; set; }
    }
} 