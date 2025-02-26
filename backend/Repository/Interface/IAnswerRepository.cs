using backend.Dtos.Answers;

namespace backend.Repository.Interface
{
    public interface IAnswerRepository
    {
        Task<List<AnswerDto>> GetAnswersByQuestionIdAsync(int questionId);
        Task<AnswerDto?> GetAnswerByIdAsync(int id);
        Task<AnswerDto> CreateAnswerAsync(int userId, int questionId, CreateAnswerDto answerDto);
        Task<AnswerDto?> UpdateAnswerAsync(int id, UpdateAnswerDto answerDto);
        Task<bool> DeleteAnswerAsync(int id);
    }
} 