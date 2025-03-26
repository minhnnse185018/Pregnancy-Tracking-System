using Newtonsoft.Json;


namespace backend.Dtos.FetalGrowth
{
    public class FetalMeasurementDto
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        
        // Added new properties for additional measurements
        public decimal? BiparietalDiameterCm { get; set; }
        public decimal? FemoralLengthCm { get; set; }
        public decimal? HeadCircumferenceCm { get; set; }
        public decimal? AbdominalCircumferenceCm { get; set; }

        public DateTime MeasurementDate { get; set; }
        
        public string? Notes { get; set; }
        public int Week { get; set; }
    }
} 