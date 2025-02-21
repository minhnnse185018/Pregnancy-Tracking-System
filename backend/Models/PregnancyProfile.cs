namespace backend.Models
{
    public class PregnancyProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime? ConceptionDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string? PregnancyStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<FetalMeasurement> FetalMeasurements { get; set; } = new List<FetalMeasurement>();
    }
} 