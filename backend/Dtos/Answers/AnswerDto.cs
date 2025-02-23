namespace backend.Dtos.Answers
{
    public class AnswerDto
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? AnswerText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 