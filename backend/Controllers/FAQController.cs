using backend.Dtos.FAQs;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FAQController : ControllerBase
    {
        private readonly IFAQRepository _faqRepository;

        public FAQController(IFAQRepository faqRepository)
        {
            _faqRepository = faqRepository;
        }

        [HttpGet("GetAllFAQs")]
        public async Task<IActionResult> GetAllFAQs()
        {
            var faqs = await _faqRepository.GetAllFAQsAsync();
            return Ok(faqs);
        }

        [HttpGet("GetFAQById/{id}")]
        public async Task<IActionResult> GetFAQById(int id)
        {
            var faq = await _faqRepository.GetFAQByIdAsync(id);
            return faq == null ? NotFound() : Ok(faq);
        }

        [HttpGet("GetFAQsByCategory/{category}")]
        public async Task<IActionResult> GetFAQsByCategory(string category)
        {
            var faqs = await _faqRepository.GetFAQsByCategoryAsync(category);
            return Ok(faqs);
        }

        [HttpPost("CreateFAQ")]
        public async Task<IActionResult> CreateFAQ([FromBody] CreateFAQDto faqDto)
        {
            var result = await _faqRepository.CreateFAQAsync(faqDto);
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpPut("UpdateFAQ/{id}")]
        public async Task<IActionResult> UpdateFAQ(int id, [FromBody] UpdateFAQDto faqDto)
        {
            var faq = await _faqRepository.UpdateFAQAsync(id, faqDto);
            return faq == null ? NotFound() : Ok(faq);
        }

        [HttpDelete("DeleteFAQ/{id}")]
        public async Task<IActionResult> DeleteFAQ(int id)
        {
            var result = await _faqRepository.DeleteFAQAsync(id);
            return result > 0 ? Ok() : NotFound();
        }
    }
} 