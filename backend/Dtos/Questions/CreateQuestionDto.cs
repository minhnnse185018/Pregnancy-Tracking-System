namespace backend.Dtos.Questions
{
    public class CreateQuestionDto
    {
        public int UserId { get; set; }
        public string? QuestionText { get; set; }
    }
} 