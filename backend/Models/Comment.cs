namespace backend.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
<<<<<<< HEAD
        public string? Content { get; set; }
=======
        public string? CommentText { get; set; }
>>>>>>> origin/truong-son
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual Post Post { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
} 