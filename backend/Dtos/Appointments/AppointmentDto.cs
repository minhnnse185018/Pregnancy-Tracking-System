<<<<<<< HEAD
using Newtonsoft.Json;
using backend.Helpers;

=======
>>>>>>> origin/truong-son
namespace backend.Dtos.Appointments
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
<<<<<<< HEAD
        
     
        public DateTime AppointmentDate { get; set; }
        
        public string? Purpose { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
      
        public DateTime CreatedAt { get; set; }
        
       
=======
        public DateTime AppointmentDate { get; set; }
        public string? Purpose { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
>>>>>>> origin/truong-son
        public DateTime UpdatedAt { get; set; }
    }
} 