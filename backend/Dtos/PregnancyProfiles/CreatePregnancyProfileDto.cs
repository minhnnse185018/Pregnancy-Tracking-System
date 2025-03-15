using Newtonsoft.Json;


namespace backend.Dtos.PregnancyProfiles
{
    public class CreatePregnancyProfileDto
    {
        public int UserId { get; set; }
        
        public DateTime ConceptionDate { get; set; }
        

        public DateTime DueDate { get; set; }
    }
} 