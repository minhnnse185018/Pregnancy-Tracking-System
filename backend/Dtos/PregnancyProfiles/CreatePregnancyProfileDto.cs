using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.PregnancyProfiles
{
    public class CreatePregnancyProfileDto
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        
        [Range(1, 42, ErrorMessage = "Pregnancy week must be between 1 and 42")]
        public int WeekOfPregnancy { get; set; }
        
        public DateTime DueDate { get; set; }
    }
}