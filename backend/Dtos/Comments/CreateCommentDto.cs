namespace backend.Dtos
{
    public class CreateCommentDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }

        public string Content { get; set; } = null!;
    }
} 