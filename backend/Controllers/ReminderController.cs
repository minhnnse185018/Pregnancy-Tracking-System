using backend.Models;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReminderController : ControllerBase
    {
        private readonly IReminderServices _reminderServices;

        public ReminderController(IReminderServices reminderServices)
        {
            _reminderServices = reminderServices;
        }

        // GET: api/Reminder
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reminder>>> GetAllReminders()
        {
            var reminders = await _reminderServices.GetAllRemindersAsync();
            return Ok(reminders);
        }

        // GET: api/Reminder/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reminder>> GetReminderById(int id)
        {
            var reminder = await _reminderServices.GetReminderByIdAsync(id);
            if (reminder == null)
            {
                return NotFound();
            }
            return Ok(reminder);
        }

        // GET: api/Reminder/week/12
        [HttpGet("week/{week}")]
        public async Task<ActionResult<Reminder>> GetReminderByWeek(int week)
        {
            var reminder = await _reminderServices.GetReminderByWeekAsync(week);
            if (reminder == null)
            {
                return NotFound();
            }
            return Ok(reminder);
        }

        // POST: api/Reminder
        [HttpPost]
        public async Task<ActionResult<Reminder>> CreateReminder(Reminder reminder)
        {
            await _reminderServices.CreateReminderAsync(reminder);
            return CreatedAtAction(nameof(GetReminderById), new { id = reminder.Id }, reminder);
        }

        // PUT: api/Reminder/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReminder(int id, Reminder reminder)
        {
            if (id != reminder.Id)
            {
                return BadRequest();
            }

            await _reminderServices.UpdateReminderAsync(reminder);
            return NoContent();
        }

        // DELETE: api/Reminder/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReminder(int id)
        {
            await _reminderServices.DeleteReminderAsync(id);
            return NoContent();
        }

        // POST: api/Reminder/send
        [HttpPost("send")]
        public async Task<IActionResult> SendPregnancyReminder()
        {
            await _reminderServices.SendPregnancyReminderAsync();
            return Ok(new { message = "Pregnancy reminders sent successfully" });
        }
    }
}
