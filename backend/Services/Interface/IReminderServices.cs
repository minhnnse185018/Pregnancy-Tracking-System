using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services.Interface
{
    public interface IReminderServices
    {
        Task SendPregnancyReminderAsync();
    }
}