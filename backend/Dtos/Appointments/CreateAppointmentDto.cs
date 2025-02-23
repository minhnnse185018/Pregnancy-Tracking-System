namespace backend.Dtos.Appointments
{
    public class CreateAppointmentDto
    {
        public int UserId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Purpose { get; set; }
        public string? Notes { get; set; }
        public string? Status { get; set; }
    }
} 