namespace backend.Dtos
{
    public class UpdateCommentDto
    {
        public int PostId { get; set; }
        public string Content { get; set; } = null!;

    }
} 