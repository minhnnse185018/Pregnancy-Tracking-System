using AutoMapper;
using backend.Data;
using backend.Dtos.Answers;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class AnswerRepository : IAnswerRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public AnswerRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<AnswerDto>> GetAnswersByQuestionIdAsync(int questionId)
        {
            var answers = await _context.Answers
                .Include(a => a.User)
                .Where(a => a.QuestionId == questionId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<AnswerDto>>(answers);
        }

        public async Task<AnswerDto?> GetAnswerByIdAsync(int id)
        {
            var answer = await _context.Answers
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id);

            return answer == null ? null : _mapper.Map<AnswerDto>(answer);
        }

        public async Task<AnswerDto> CreateAnswerAsync(int userId, int questionId, CreateAnswerDto answerDto)
        {
            var answer = _mapper.Map<Answer>(answerDto);
            answer.UserId = userId;
            answer.QuestionId = questionId;
            answer.CreatedAt = DateTime.Now;

            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();

            return await GetAnswerByIdAsync(answer.Id);
        }

        public async Task<AnswerDto?> UpdateAnswerAsync(int id, UpdateAnswerDto answerDto)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null) return null;

            _mapper.Map(answerDto, answer);

            await _context.SaveChangesAsync();
            return await GetAnswerByIdAsync(id);
        }

        public async Task<bool> DeleteAnswerAsync(int id)
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null) return false;

            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 