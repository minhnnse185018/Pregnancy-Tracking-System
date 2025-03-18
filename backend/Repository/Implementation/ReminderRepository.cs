using backend.Data;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repository.Implementation
{
    public class ReminderRepository : IReminderRepository
    {
        private readonly ApplicationDBContext _context;

        public ReminderRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Reminder>> GetAllRemindersAsync()
        {
            return await _context.Reminders.ToListAsync();
        }

        public async Task<Reminder?> GetReminderByIdAsync(int id)
        {
            return await _context.Reminders.FindAsync(id);
        }

        public async Task<Reminder?> GetReminderByWeekAsync(int week)
        {
            return await _context.Reminders.FirstOrDefaultAsync(r => r.Week == week);
        }

        public async Task AddReminderAsync(Reminder reminder)
        {
            await _context.Reminders.AddAsync(reminder);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReminderAsync(Reminder reminder)
        {
            _context.Reminders.Update(reminder);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteReminderAsync(int id)
        {
            var reminder = await _context.Reminders.FindAsync(id);
            if (reminder != null)
            {
                _context.Reminders.Remove(reminder);
                await _context.SaveChangesAsync();
            }
        }
    }
}
