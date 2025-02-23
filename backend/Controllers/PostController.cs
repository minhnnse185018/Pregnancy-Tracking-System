using backend.Dtos.Posts;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostRepository _postRepository;

        public PostController(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postRepository.GetAllPostsAsync();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var post = await _postRepository.GetPostByIdAsync(id);
            return post == null ? NotFound() : Ok(post);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPostsByUserId(int userId)
        {
            var posts = await _postRepository.GetPostsByUserIdAsync(userId);
            return Ok(posts);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto postDto)
        {
            // TODO: Get userId from token
            int userId = 1; // Temporary
            var post = await _postRepository.CreatePostAsync(userId, postDto);
            return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, post);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostDto postDto)
        {
            var post = await _postRepository.UpdatePostAsync(id, postDto);
            return post == null ? NotFound() : Ok(post);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var result = await _postRepository.DeletePostAsync(id);
            return result ? Ok() : NotFound();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchPosts([FromQuery] string searchTerm)
        {
            var posts = await _postRepository.SearchPostsAsync(searchTerm);
            return Ok(posts);
        }
    }
} 