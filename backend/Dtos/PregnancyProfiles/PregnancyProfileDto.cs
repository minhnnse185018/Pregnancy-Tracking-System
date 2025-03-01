<<<<<<< HEAD
using Newtonsoft.Json;
using backend.Helpers;

=======
>>>>>>> origin/truong-son
namespace backend.Dtos.PregnancyProfiles
{
    public class PregnancyProfileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
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
        public DateTime CreatedAt { get; set; }
        public List<FetalGrowth.FetalMeasurementDto> FetalMeasurements { get; set; } = new();
    }
} 