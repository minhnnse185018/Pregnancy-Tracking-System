using Microsoft.AspNetCore.Http;

namespace backend.Dtos.Posts
{
    public class UpdatePostDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
        public string? Status { get; set; }
    }
}