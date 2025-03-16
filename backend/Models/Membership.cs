namespace backend.Models
{
    public class Membership
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PlanId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual MembershipPlan Plan { get; set; } = null!;
        public virtual Payment? Payment { get; set; }
    }
} 