using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = "Scheduled"; // "Scheduled", "Completed", "Cancelled"
        public bool ReminderSent { get; set; } = false; // Thêm để theo dõi nhắc nhở
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public virtual User User { get; set; } = null!;
        public virtual ScheduledEmail? ScheduledEmail { get; set; } // Liên kết với ScheduledEmail
    }
} 