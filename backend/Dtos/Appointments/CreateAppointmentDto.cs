namespace backend.Dtos.Appointments
{
    public class CreateAppointmentDto
    {
        public int UserId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }
} 