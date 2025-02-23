namespace backend.Dtos.Answers
{
    public class CreateAnswerDto
    {
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public string? AnswerText { get; set; }
    }
} 