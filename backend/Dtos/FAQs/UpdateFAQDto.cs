namespace backend.Dtos.FAQs
{
    public class UpdateFAQDto
    {
        public string? Question { get; set; }
        public string? Answer { get; set; }
        public string? Category { get; set; }
        public int? DisplayOrder { get; set; }
    }
} 