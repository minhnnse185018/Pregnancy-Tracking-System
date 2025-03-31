using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace backend.Dtos.PregnancyProfiles
{
    public class UpdatePregnancyProfileDto
    {
        public string? Name { get; set; }
        public DateTime? ConceptionDate { get; set; }
        public DateTime? DueDate { get; set; }
    }
}