using Newtonsoft.Json;


namespace backend.Dtos.PregnancyProfiles
{
    public class UpdatePregnancyProfileDto
    {
        public DateTime? ConceptionDate { get; set; }
        public DateTime? DueDate { get; set; }
    }
}