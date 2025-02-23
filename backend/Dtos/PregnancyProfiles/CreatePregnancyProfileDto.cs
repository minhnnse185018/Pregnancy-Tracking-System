namespace backend.Dtos.PregnancyProfiles
{
    public class CreatePregnancyProfileDto
    {
        public int UserId { get; set; }
        public DateOnly ConceptionDate { get; set; }
        public DateOnly DueDate { get; set; }
        public string? PregnancyStatus { get; set; }
    }
} 