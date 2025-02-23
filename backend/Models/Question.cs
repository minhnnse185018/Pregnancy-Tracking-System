namespace backend.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; } = "pending";
        public string? QuestionText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
} 