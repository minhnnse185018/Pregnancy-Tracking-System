using Newtonsoft.Json;


namespace backend.Dtos.PregnancyProfiles
{
    public class PregnancyProfileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Name { get; set; } = null!;

        public DateTime ConceptionDate { get; set; }


        public DateTime DueDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public string PregnancyStatus { get; set; } = null!;

    }
}