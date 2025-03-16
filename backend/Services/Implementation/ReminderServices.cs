using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class ReminderServices : IReminderServices
    {
        private readonly ApplicationDBContext _context;
        private readonly IEmailService _emailService;
        public ReminderServices(ApplicationDBContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }
        public async Task SendPregnancyReminderAsync()
        {
            var profiles= await _context.PregnancyProfiles
            .Include(p => p.User)
            .ToListAsync();
            foreach (var profile in profiles)
            {
                int currentWeek = ((DateTime.Now - profile.ConceptionDate).Days+1)/ 7;
                var reminder = await _context.Reminders.FirstOrDefaultAsync(r => r.Week == currentWeek);
                if (reminder != null)
                {
                    await _emailService.SendEmailAsync(profile.User.Email, reminder.Subject, reminder.Body);
                }
            }
        }
    }
}