namespace backend.Dtos.Memberships
{
    public class CreateMembershipDto
    {
        public int UserId { get; set; }
        public int PlanId { get; set; }
        public DateTime StartDate { get; set; }
    }
} 