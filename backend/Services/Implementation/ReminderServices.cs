using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class ReminderServices : IReminderServices
    {
        private readonly ApplicationDBContext _context;
        private readonly IEmailService _emailService;
        private readonly IReminderRepository _reminderRepository;

        public ReminderServices(
            ApplicationDBContext context, 
            IEmailService emailService,
            IReminderRepository reminderRepository)
        {
            _context = context;
            _emailService = emailService;
            _reminderRepository = reminderRepository;
        }

        public async Task SendPregnancyReminderAsync()
        {
            var profiles = await _context.PregnancyProfiles
                .Include(p => p.User)
                .ToListAsync();
                
            foreach (var profile in profiles)
            {
                int currentWeek = ((DateTime.Now - profile.ConceptionDate).Days + 1) / 7;
                var reminder = await _reminderRepository.GetReminderByWeekAsync(currentWeek);
                
                if (reminder != null)
                {
                    await _emailService.SendEmailAsync(profile.User.Email, reminder.Subject, reminder.Body);
                }
            }
        }

        public async Task<IEnumerable<Reminder>> GetAllRemindersAsync()
        {
            return await _reminderRepository.GetAllRemindersAsync();
        }

        public async Task<Reminder> GetReminderByIdAsync(int id)
        {
            return await _reminderRepository.GetReminderByIdAsync(id);
        }

        public async Task<Reminder> GetReminderByWeekAsync(int week)
        {
            return await _reminderRepository.GetReminderByWeekAsync(week);
        }

        public async Task CreateReminderAsync(Reminder reminder)
        {
            await _reminderRepository.AddReminderAsync(reminder);
        }

        public async Task UpdateReminderAsync(Reminder reminder)
        {
            await _reminderRepository.UpdateReminderAsync(reminder);
        }

        public async Task DeleteReminderAsync(int id)
        {
            await _reminderRepository.DeleteReminderAsync(id);
        }
    }
}