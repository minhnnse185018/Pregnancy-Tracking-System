using AutoMapper;
using backend.Data;
using backend.Dtos.Questions;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public QuestionRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _context.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                    .ThenInclude(a => a.User)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<QuestionDto>>(questions);
        }

        public async Task<QuestionDto?> GetQuestionByIdAsync(int id)
        {
            var question = await _context.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                    .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(q => q.Id == id);

            return question == null ? null : _mapper.Map<QuestionDto>(question);
        }

        public async Task<List<QuestionDto>> GetQuestionsByUserIdAsync(int userId)
        {
            var questions = await _context.Questions
                .Include(q => q.User)
                .Include(q => q.Answers)
                    .ThenInclude(a => a.User)
                .Where(q => q.UserId == userId)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<QuestionDto>>(questions);
        }

        public async Task<QuestionDto> CreateQuestionAsync(int userId, CreateQuestionDto questionDto)
        {
            var question = _mapper.Map<Question>(questionDto);
            question.UserId = userId;
            question.Status = "pending";
            question.CreatedAt = DateTime.Now;

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return await GetQuestionByIdAsync(question.Id);
        }

        public async Task<QuestionDto?> UpdateQuestionAsync(int id, UpdateQuestionDto questionDto)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return null;

            _mapper.Map(questionDto, question);

            await _context.SaveChangesAsync();
            return await GetQuestionByIdAsync(id);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return false;

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 