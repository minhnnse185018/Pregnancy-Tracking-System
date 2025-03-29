namespace backend.Dtos.Memberships
{
    public class UpgradeMembershipDto
    {
        public int UserId { get; set; }
        public int NewPlanId { get; set; }
    }
}