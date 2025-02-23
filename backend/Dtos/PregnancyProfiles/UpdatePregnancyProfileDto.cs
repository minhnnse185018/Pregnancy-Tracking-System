namespace backend.Dtos.PregnancyProfiles
{
    public class UpdatePregnancyProfileDto
    {
        public DateOnly ConceptionDate { get; set; }
        public DateOnly DueDate { get; set; }
        public string? PregnancyStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<FetalGrowth.FetalMeasurementDto> FetalMeasurements { get; set; } = new();
    }
} 