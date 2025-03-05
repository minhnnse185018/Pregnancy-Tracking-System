namespace backend.Dtos.FetalGrowth
{
    public class FetalMeasurementDto
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        public DateOnly MeasurementDate { get; set; }
        public string? Notes { get; set; }
        public int Week { get; set; }
    }
} 