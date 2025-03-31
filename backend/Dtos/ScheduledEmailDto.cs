namespace backend.Dtos
{
    public class ScheduledEmailDto
    {
        public string RecipientEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime ScheduledTime { get; set; }
    }

}
