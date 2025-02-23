using backend.Dtos.Questions;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionController(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuestions()
        {
            var questions = await _questionRepository.GetAllQuestionsAsync();
            return Ok(questions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestionById(int id)
        {
            var question = await _questionRepository.GetQuestionByIdAsync(id);
            return question == null ? NotFound() : Ok(question);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetQuestionsByUserId(int userId)
        {
            var questions = await _questionRepository.GetQuestionsByUserIdAsync(userId);
            return Ok(questions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionDto questionDto)
        {
            // TODO: Get userId from token
            int userId = 1; // Temporary
            var question = await _questionRepository.CreateQuestionAsync(userId, questionDto);
            return CreatedAtAction(nameof(GetQuestionById), new { id = question.Id }, question);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateQuestionDto questionDto)
        {
            var question = await _questionRepository.UpdateQuestionAsync(id, questionDto);
            return question == null ? NotFound() : Ok(question);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var result = await _questionRepository.DeleteQuestionAsync(id);
            return result ? Ok() : NotFound();
        }
    }
} 