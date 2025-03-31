using backend.Dtos.Memberships;

namespace backend.Services.Interface
{
    public interface IMembershipService
    {
        Task<MembershipDto> CreatePendingMembershipAsync(CreateMembershipDto membershipDto);
        Task<MembershipDto> ActivateMembershipAsync(int membershipId);
        Task<List<MembershipDto>> GetMembershipsByUserIdAsync(int userId);
        Task<bool> IsMembershipActiveAsync(int userId);
        Task CleanupExpiredMembershipsAsync();
        Task<MembershipDto> UpgradeMembershipAsync(int userId, int newPlanId); 
    }
}