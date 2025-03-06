namespace backend.Dtos.FAQs
{
    public class CreateFAQDto
    {
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;
        public string? Category { get; set; }
        public int DisplayOrder { get; set; }
    }
} 