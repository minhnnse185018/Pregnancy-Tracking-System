namespace backend.Dtos
{
    public class CreateCommentDto
    {
        public int PostId { get; set; }
        public string Content { get; set; } = null!;
        public string? AuthorType { get; set; }
    }
} 