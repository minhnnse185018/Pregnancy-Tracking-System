using Newtonsoft.Json;
using System;

namespace backend.Dtos.Appointments
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        [JsonProperty(PropertyName = "appointmentDate")]
        public DateTime AppointmentDate { get; set; }
        
        [JsonProperty(PropertyName = "appointmentDateDisplay")]
        public string AppointmentDateDisplay => AppointmentDate.ToString("yyyy-MM-dd");
        
        public string? Title { get; set; }
        public string Status { get; set; }
        public string? Description { get; set; }
    }
}