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

        [HttpGet("{Userid}")]
        public async Task<IActionResult> GetCommentByUserId(int id)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(id);
            return comment == null ? NotFound() : Ok(comment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto commentDto)
        {
           
            
            return await _commentRepository.CreateCommentAsync( commentDto)>0?Ok():BadRequest();
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
            var result = await _commentRepository.DeleteCommentAsync(id);
            return result>0 ? Ok() : NotFound();
        }
    }
} 