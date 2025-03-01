<<<<<<< HEAD
using Newtonsoft.Json;
using backend.Helpers;

=======
>>>>>>> origin/truong-son
namespace backend.Models
{
    public class PregnancyProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
<<<<<<< HEAD
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly ConceptionDate { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly DueDate { get; set; }
        
=======
        public DateOnly ConceptionDate { get; set; }
        public DateOnly DueDate { get; set; }
>>>>>>> origin/truong-son
        public string? PregnancyStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<FetalMeasurement> FetalMeasurements { get; set; } = new List<FetalMeasurement>();
    }
} 