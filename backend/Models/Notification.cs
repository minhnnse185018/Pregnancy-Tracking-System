using System;

namespace backend.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? RelatedEntityId { get; set; } // Store the ID of the related post or comment
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
} 