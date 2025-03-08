using backend.Dtos.FAQs;

namespace backend.Repository.Interface
{
    public interface IFAQRepository
    {
        Task<List<FAQDto>> GetAllFAQsAsync();
        Task<FAQDto?> GetFAQByIdAsync(int id);
        Task<List<FAQDto>> GetFAQsByCategoryAsync(string category);
        Task<int> CreateFAQAsync(CreateFAQDto faqDto);
        Task<FAQDto?> UpdateFAQAsync(int id, UpdateFAQDto faqDto);
        Task<int> DeleteFAQAsync(int id);
    }
} 