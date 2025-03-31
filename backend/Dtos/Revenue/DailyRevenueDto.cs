using System;

namespace backend.Dtos.Revenue
{
    public class DailyRevenueDto
    {
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public int TransactionCount { get; set; }
    }
}
