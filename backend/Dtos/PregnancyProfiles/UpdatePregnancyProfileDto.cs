using Newtonsoft.Json;
using backend.Helpers;

namespace backend.Dtos.PregnancyProfiles
{
    public class UpdatePregnancyProfileDto
    {
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly ConceptionDate { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly DueDate { get; set; }
        
        public string? PregnancyStatus { get; set; }
    }
} 