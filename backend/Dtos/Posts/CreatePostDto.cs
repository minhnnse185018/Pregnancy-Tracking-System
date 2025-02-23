namespace backend.Dtos.Posts
{
    public class CreatePostDto
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? AuthorType { get; set; }
    }
} 