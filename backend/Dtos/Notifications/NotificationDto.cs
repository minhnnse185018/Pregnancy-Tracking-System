namespace backend.Dtos.Notifications
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? RelatedEntityId { get; set; }
    }
} 