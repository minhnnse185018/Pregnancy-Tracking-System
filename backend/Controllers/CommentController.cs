using backend.Dtos;
using backend.Dtos.Comments;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;

        public CommentController(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetCommentsByPostId(int postId)
        {
            var comments = await _commentRepository.GetCommentsByPostIdAsync(postId);
            return Ok(comments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentById(int id)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(id);
            return comment == null ? NotFound() : Ok(comment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto commentDto)
        {
            // TODO: Get userId from token
            int userId = 1; // Temporary
            var comment = await _commentRepository.CreateCommentAsync(userId, commentDto.PostId, commentDto);
            return CreatedAtAction(nameof(GetCommentById), new { id = comment.Id }, comment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDto commentDto)
        {
            var comment = await _commentRepository.UpdateCommentAsync(id, commentDto);
            return comment == null ? NotFound() : Ok(comment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var result = await _commentRepository.DeleteCommentAsync(id);
            return result ? Ok() : NotFound();
        }
    }
} 