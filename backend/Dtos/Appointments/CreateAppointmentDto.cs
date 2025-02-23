namespace backend.Dtos.Appointments
{
    public class CreateAppointmentDto
    {
        public DateTime AppointmentDate { get; set; }
        public string? Purpose { get; set; }
        public string? Notes { get; set; }
    }
} 