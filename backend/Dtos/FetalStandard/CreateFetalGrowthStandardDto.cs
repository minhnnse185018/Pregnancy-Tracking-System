namespace backend.Dtos.FetalStandard
{
    public class CreateFetalGrowthStandardDto
    {
        public int WeekNumber { get; set; }
        public string? MeasurementType { get; set; }
        public decimal MinValue { get; set; }
        public decimal MedianValue { get; set; }
        public decimal MaxValue { get; set; }
    }
} 