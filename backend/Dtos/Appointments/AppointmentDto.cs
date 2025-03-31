using Newtonsoft.Json;
using System;

namespace backend.Dtos.Appointments
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        
        public DateTime AppointmentDate { get; set; }
        
        public string? Title { get; set; }
        public string Status { get; set; }
        public string? Description { get; set; }
    }
}