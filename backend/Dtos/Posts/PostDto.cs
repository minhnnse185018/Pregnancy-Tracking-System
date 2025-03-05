using backend.Dtos.Comments;

namespace backend.Dtos.Posts
{
    public class PostDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Image { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? UserName { get; set; }
        public int CommentCount { get; set; }
        public List<CommentDto> Comments { get; set; } = new List<CommentDto>();
    }
} 