<<<<<<< HEAD
using Newtonsoft.Json;
using backend.Helpers;

=======
>>>>>>> origin/truong-son
namespace backend.Models
{
    public class FetalMeasurement
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
<<<<<<< HEAD
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly MeasurementDate { get; set; }
        
=======
        public DateOnly MeasurementDate { get; set; }
>>>>>>> origin/truong-son
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
<<<<<<< HEAD
                Week = (int)Math.Floor(daysDifference / 7.0) + 1; // Add 1 to start from week 1
                
                // Ensure week is not negative
                if (Week < 1) Week = 1;
=======
                Week = (int)Math.Floor(daysDifference / 7.0);
>>>>>>> origin/truong-son
            }
        }
    }
} 