using Newtonsoft.Json;


namespace backend.Models
{
    public class FetalMeasurement
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        
        public DateTime MeasurementDate { get; set; }
        
        public string? Notes { get; set; }
        public int Week { get; protected set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual PregnancyProfile Profile { get; set; } = null!;
        public virtual ICollection<GrowthAlert> GrowthAlerts { get; set; } = new List<GrowthAlert>();

        // Method to calculate week
        public void CalculateWeek()
        {
            if (Profile != null)
            {
                TimeSpan difference = MeasurementDate - Profile.ConceptionDate;
                Week = (int)Math.Floor(difference.TotalDays / 7.0) + 1;
                if (Week < 1) Week = 1;
            }
        }
    }
} 