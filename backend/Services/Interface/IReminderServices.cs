using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Services.Interface
{
    public interface IReminderServices
    {
        Task SendPregnancyReminderAsync();
        Task<IEnumerable<Reminder>> GetAllRemindersAsync();
        Task<Reminder> GetReminderByIdAsync(int id);
        Task<Reminder> GetReminderByWeekAsync(int week);
        Task CreateReminderAsync(Reminder reminder);
        Task UpdateReminderAsync(Reminder reminder);
        Task DeleteReminderAsync(int id);
    }
}