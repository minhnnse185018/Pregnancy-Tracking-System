using Newtonsoft.Json;

namespace backend.Dtos.FetalGrowth
{
    public class CreateFetalMeasurementDto
    {
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        
        // Removed MeasurementDate
        public int Week { get; set; } // Added Week property
        
        public string? Notes { get; set; }
    }
}