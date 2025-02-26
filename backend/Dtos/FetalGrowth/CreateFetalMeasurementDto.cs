using Newtonsoft.Json;
using backend.Helpers;

namespace backend.Dtos.FetalGrowth
{
    public class CreateFetalMeasurementDto
    {
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly MeasurementDate { get; set; }
        
        public string? Notes { get; set; }
    }
} 