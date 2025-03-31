using backend.Dtos;
using backend.Dtos.Comments;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using backend.Services.Interface;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IPostRepository _postRepository;
        private readonly INotificationService _notificationService;
        private readonly IUserRepository _userRepository;

        public CommentController(
            ICommentRepository commentRepository,
            IPostRepository postRepository,
            INotificationService notificationService,
            IUserRepository userRepository)
        {
            _commentRepository = commentRepository;
            _postRepository = postRepository;
            _notificationService = notificationService;
            _userRepository = userRepository;
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetCommentsByPostId(int postId)
        {
            var comments = await _commentRepository.GetCommentsByPostIdAsync(postId);
            return Ok(comments);
        }

        [HttpGet("{Userid}")]
        public async Task<IActionResult> GetCommentByUserId(int id)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(id);
            return comment == null ? NotFound() : Ok(comment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto commentDto)
        {
            var result = await _commentRepository.CreateCommentAsync(commentDto);
            if (result <= 0) return BadRequest();

            // Get post details
            var post = await _postRepository.GetPostByIdAsync(commentDto.PostId);
            if (post != null && post.UserId != commentDto.UserId) // Don't notify if user comments on their own post
            {
                // Get commenter's name
                var user = await _userRepository.GetUserByIdAsync(commentDto.UserId);
                string userName = user?.FirstName+user?.LastName ?? "Someone"; // Use email or fallback to "Someone"

                // Create notification for post owner
                await _notificationService.CreateNotificationAsync(
                    post.UserId,
                    $"{userName} has commented to your post \"{post.Title}\"",
                    commentDto.PostId
                );
            }

            return Ok();
        }

        [HttpPut("UpdateComment/{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDto commentDto)
        {
            var comment = await _commentRepository.UpdateCommentAsync(id, commentDto);
            return comment == null ? NotFound() : Ok(comment);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(id);
            if (comment == null) return NotFound();

            // Get post details before deleting comment
            var post = await _postRepository.GetPostByIdAsync(comment.PostId);
            if (post == null) return NotFound();

            var result = await _commentRepository.DeleteCommentAsync(id);
            if (result <= 0) return NotFound();

            // Create notification for comment owner
            await _notificationService.CreateNotificationAsync(
                comment.UserId,
                $"Your comment in the post \"{post.Title}\" is deleted because of violation.",
                comment.PostId
            );

            return Ok();
        }
    }
} 