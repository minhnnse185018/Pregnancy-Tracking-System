
namespace backend.Models
{
    public class ScheduledEmail
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; } // Liên kết với Appointment
        public string RecipientEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime ScheduledTime { get; set; }
        public bool IsSent { get; set; } = false;

        public virtual Appointment Appointment { get; set; } = null!;
    }

}
