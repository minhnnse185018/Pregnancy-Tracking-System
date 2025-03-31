using backend.Dtos.Posts;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using backend.Services.Interface;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostRepository _postRepository;
        private readonly INotificationService _notificationService;

        public PostController(
            IPostRepository postRepository,
            INotificationService notificationService)
        {
            _postRepository = postRepository;
            _notificationService = notificationService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllPostsAsync()
        {
            var posts = await _postRepository.GetAllPostsAsync();
            return Ok(posts);
        }

        [HttpGet("GetPostById/{id}")]
        public async Task<IActionResult> GetPostByIdAsync(int id)
        {
            var post = await _postRepository.GetPostByIdAsync(id);
            return post == null ? NotFound() : Ok(post);
        }

        [HttpGet("GetByUserId/{userId}")]
        public async Task<IActionResult> GetPostsByUserId(int userId)
        {
            var posts = await _postRepository.GetPostsByUserIdAsync(userId);
            return posts==null? NotFound():Ok(posts);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePostAsync([FromForm] CreatePostDto postDto)
        {
            
            return await _postRepository.CreatePostAsync(postDto)>0?Ok():BadRequest();
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdatePostAsync(int id, [FromForm] UpdatePostDto postDto)
        {
            var post = await _postRepository.UpdatePostAsync(id, postDto);
            return post == null ? NotFound() : Ok(post);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _postRepository.GetPostByIdAsync(id);
            if (post == null) return NotFound();

            // Store post information before deletion
            int postOwnerId = post.UserId;
            string postTitle = post.Title;

            var result = await _postRepository.DeletePostAsync(id);
            if (result <= 0) return NotFound();

            // Create notification for post owner
            await _notificationService.CreateNotificationAsync(
                postOwnerId,
                $"Your post \"{postTitle}\" is deleted by Admin because of violation",
                id
            );

            return Ok();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchPosts([FromQuery] string searchTerm)
        {
            var posts = await _postRepository.SearchPostsAsync(searchTerm);
            return Ok(posts);
        }
    }
} 