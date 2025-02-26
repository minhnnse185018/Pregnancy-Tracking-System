using Newtonsoft.Json;
using backend.Helpers;

namespace backend.Dtos.PregnancyProfiles
{
    public class CreatePregnancyProfileDto
    {
        public int UserId { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly ConceptionDate { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly DueDate { get; set; }
        
        public string? PregnancyStatus { get; set; }
    }
} 