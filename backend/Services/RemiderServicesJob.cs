using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Services.Interface;
using Quartz;

namespace backend.Services
{
    public class RemiderServicesJob:IJob
    {
        private readonly IReminderServices _reminderServices;
        public RemiderServicesJob(IReminderServices reminderServices)
        {
            _reminderServices = reminderServices;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            await _reminderServices.SendPregnancyReminderAsync();
        }
        
    }
}