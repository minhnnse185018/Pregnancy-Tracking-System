namespace backend.Dtos.Revenue
{
    public class MonthlyRevenueDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Amount { get; set; }
        public int TransactionCount { get; set; }
    }
}
