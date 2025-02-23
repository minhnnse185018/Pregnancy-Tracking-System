using backend.Dtos.Answers;

namespace backend.Dtos.Questions
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string Status { get; set; } = "pending";
        public string? QuestionText { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<AnswerDto> Answers { get; set; } = new List<AnswerDto>();
        public int AnswerCount { get; set; }
    }
} 