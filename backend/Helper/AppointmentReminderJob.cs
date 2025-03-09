using backend.Services.Interface;
using Quartz;

namespace backend.Helper
{
    public class AppointmentReminderJob : IJob
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentReminderJob(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            await _appointmentService.SendAppointmentRemindersAsync();
        }
    }
}
