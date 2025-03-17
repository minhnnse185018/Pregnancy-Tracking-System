namespace backend.Dtos.Appointments
{
    public class UpdateAppointmentDto
    {

        public DateTime AppointmentDate { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }
}