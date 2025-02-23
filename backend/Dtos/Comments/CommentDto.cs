namespace backend.Dtos.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string? AuthorType { get; set; }
        public string Content { get; set; } = null!;
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? UserName { get; set; } // Additional field for displaying commenter name
    }
} 