using Microsoft.AspNetCore.Http;

namespace backend.Dtos.Posts
{
    public class CreatePostDto
    {
        public int UserId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
    }
}