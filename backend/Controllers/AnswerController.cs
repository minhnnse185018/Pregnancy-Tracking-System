using backend.Dtos.Answers;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerRepository _answerRepository;

        public AnswerController(IAnswerRepository answerRepository)
        {
            _answerRepository = answerRepository;
        }

        [HttpGet("question/{questionId}")]
        public async Task<IActionResult> GetAnswersByQuestionId(int questionId)
        {
            var answers = await _answerRepository.GetAnswersByQuestionIdAsync(questionId);
            return Ok(answers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnswerById(int id)
        {
            var answer = await _answerRepository.GetAnswerByIdAsync(id);
            return answer == null ? NotFound() : Ok(answer);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAnswer([FromBody] CreateAnswerDto answerDto)
        {
            // TODO: Get userId from token
            int userId = 1; // Temporary
            var answer = await _answerRepository.CreateAnswerAsync(userId, answerDto.QuestionId, answerDto);
            return CreatedAtAction(nameof(GetAnswerById), new { id = answer.Id }, answer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnswer(int id, [FromBody] UpdateAnswerDto answerDto)
        {
            var answer = await _answerRepository.UpdateAnswerAsync(id, answerDto);
            return answer == null ? NotFound() : Ok(answer);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnswer(int id)
        {
            var result = await _answerRepository.DeleteAnswerAsync(id);
            return result ? Ok() : NotFound();
        }
    }
} 