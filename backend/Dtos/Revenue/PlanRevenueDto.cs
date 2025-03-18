namespace backend.Dtos.Revenue
{
    public class PlanRevenueDto
    {
        public int PlanId { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int SubscriptionCount { get; set; }
    }
}
