namespace backend.Dtos.MembershipPlans
{
    public class CreateMembershipPlanDto
    {
        public string PlanName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; }
    }
} 