using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace backend.Models
{
    public class PregnancyProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public DateTime ConceptionDate { get; set; }
        public DateTime DueDate { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string PregnancyStatus { get; set; } = null!; // This will be computed by the database

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<FetalMeasurement> FetalMeasurements { get; set; } = new List<FetalMeasurement>();
    }
} 