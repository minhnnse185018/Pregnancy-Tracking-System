namespace backend.Dtos.PregnancyProfiles
{
    public class CreatePregnancyProfileDto
    {
        public int UserId { get; set; }
        public DateOnly ConceptionDate { get; set; }
        public DateOnly DueDate { get; set; }
        public string? PregnancyStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<FetalGrowth.FetalMeasurementDto> FetalMeasurements { get; set; } = new();
    }
} 