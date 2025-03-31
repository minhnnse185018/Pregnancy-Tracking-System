namespace backend.Dtos.Appointments
{
    public class UpdateAppointmentDto
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }

    }
} 