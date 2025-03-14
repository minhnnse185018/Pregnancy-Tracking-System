using Newtonsoft.Json;

namespace backend.Dtos.FetalGrowth
{
    public class UpdateFetalMeasurementDto
    {
        public decimal? WeightGrams { get; set; }
        public decimal? HeightCm { get; set; }
        
        public int? Week { get; set; } // Added Week property
        
        public string? Notes { get; set; }
    }
}