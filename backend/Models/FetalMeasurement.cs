using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class FetalMeasurement
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        
        // Added new properties for additional measurements
        public decimal? BiparietalDiameterCm { get; set; }
        public decimal? FemoralLengthCm { get; set; }
        public decimal? HeadCircumferenceCm { get; set; }
        public decimal? AbdominalCircumferenceCm { get; set; }
        
        // Removed MeasurementDate
        
        public string? Notes { get; set; }
        [Range(0, 42)]
        public int Week { get; set; } // Changed to public set to allow direct input
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual PregnancyProfile Profile { get; set; } = null!;
        public virtual ICollection<GrowthAlert> GrowthAlerts { get; set; } = new List<GrowthAlert>();

        // No longer need CalculateWeek method since Week is set directly
    }
}