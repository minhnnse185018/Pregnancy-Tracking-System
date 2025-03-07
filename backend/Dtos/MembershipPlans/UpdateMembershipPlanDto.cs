namespace backend.Dtos.MembershipPlans
{
    public class UpdateMembershipPlanDto
    {
        public string? PlanName { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Duration { get; set; }
    }
} 