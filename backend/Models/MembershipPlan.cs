namespace backend.Models
{
    public class MembershipPlan
    {
        public int Id { get; set; }
        public string PlanName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; }

        // Navigation property
        public virtual ICollection<Membership> Memberships { get; set; } = new List<Membership>();
    }
} 