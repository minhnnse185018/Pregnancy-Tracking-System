namespace backend.Models
{
    public class FetalMeasurement
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public DateTime ExaminationDate { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual PregnancyProfile PregnancyProfile { get; set; } = null!;
        public virtual ICollection<GrowthAlert> GrowthAlerts { get; set; } = new List<GrowthAlert>();
    }
} 