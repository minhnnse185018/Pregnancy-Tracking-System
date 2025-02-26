using Newtonsoft.Json;
using backend.Helpers;

namespace backend.Models
{
    public class FetalMeasurement
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly MeasurementDate { get; set; }
        
        public string? Notes { get; set; }
        public int Week { get; private set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual PregnancyProfile Profile { get; set; } = null!;
        public virtual ICollection<GrowthAlert> GrowthAlerts { get; set; } = new List<GrowthAlert>();

        // Method to calculate week
        public void CalculateWeek()
        {
            if (Profile != null)
            {
                int daysDifference = MeasurementDate.DayNumber - Profile.ConceptionDate.DayNumber;
                Week = (int)Math.Floor(daysDifference / 7.0);
            }
        }
    }
} 