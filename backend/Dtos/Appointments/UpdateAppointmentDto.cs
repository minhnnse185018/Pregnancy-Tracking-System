namespace backend.Dtos.Appointments
{
    public class UpdateAppointmentDto
    {
        public DateTime? AppointmentDate { get; set; }
        public string? Purpose { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }
} 