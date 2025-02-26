namespace backend.Dtos.FetalGrowth
{
    public class UpdateFetalMeasurementDto
    {
        public decimal? WeightGrams { get; set; }
        public decimal? HeightCm { get; set; }
        public DateOnly? MeasurementDate { get; set; }
        public string? Notes { get; set; }
    }
} 