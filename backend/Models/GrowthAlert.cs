namespace backend.Models
{
    public class GrowthAlert
    {
        public int Id { get; set; }
        public int MeasurementId { get; set; }
        public string? AlertMessage { get; set; }
        public string? AlertType { get; set; }
        public string? Severity { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property
        public virtual FetalMeasurement FetalMeasurement { get; set; } = null!;
    }
} 