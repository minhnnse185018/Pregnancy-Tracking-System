namespace backend.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public string? AnswerText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual Question Question { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
} 