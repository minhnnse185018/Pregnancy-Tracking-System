using backend.Models;

namespace backend.Repository.Interface
{
    public interface IReminderRepository
    {
        Task<IEnumerable<Reminder>> GetAllRemindersAsync();
        Task<Reminder?> GetReminderByIdAsync(int id);
        Task<Reminder?> GetReminderByWeekAsync(int week); // Added missing method
        Task AddReminderAsync(Reminder reminder);
        Task UpdateReminderAsync(Reminder reminder);
        Task DeleteReminderAsync(int id);
    }
}