using backend.Dtos.Questions;

namespace backend.Repository.Interface
{
    public interface IQuestionRepository
    {
        Task<List<QuestionDto>> GetAllQuestionsAsync();
        Task<QuestionDto?> GetQuestionByIdAsync(int id);
        Task<List<QuestionDto>> GetQuestionsByUserIdAsync(int userId);
        Task<QuestionDto> CreateQuestionAsync(int userId, CreateQuestionDto questionDto);
        Task<QuestionDto?> UpdateQuestionAsync(int id, UpdateQuestionDto questionDto);
        Task<bool> DeleteQuestionAsync(int id);
    }
} 