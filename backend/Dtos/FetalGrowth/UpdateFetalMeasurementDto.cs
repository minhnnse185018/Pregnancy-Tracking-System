using Newtonsoft.Json;

namespace backend.Dtos.FetalGrowth
{
    public class UpdateFetalMeasurementDto
    {
        public decimal? WeightGrams { get; set; }
        public decimal? HeightCm { get; set; }
        
        // Added new properties for additional measurements
        public decimal? BiparietalDiameterCm { get; set; }
        public decimal? FemoralLengthCm { get; set; }
        public decimal? HeadCircumferenceCm { get; set; }
        public decimal? AbdominalCircumferenceCm { get; set; }
        
        public int? Week { get; set; }
        
        public string? Notes { get; set; }
    }
}