using System;

namespace backend.Dtos.Revenue
{
    public class RevenueSummaryDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalTransactions { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}
