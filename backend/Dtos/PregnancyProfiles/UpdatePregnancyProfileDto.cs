<<<<<<< HEAD
using Newtonsoft.Json;
using backend.Helpers;

=======
>>>>>>> origin/truong-son
namespace backend.Dtos.PregnancyProfiles
{
    public class UpdatePregnancyProfileDto
    {
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
    }
} 