using backend.Dtos.Memberships;

namespace backend.Services.Implementation
{
    public interface IMembershipService
    {
        Task<MembershipDto> CreatePendingMembershipAsync(CreateMembershipDto membershipDto);
        Task<MembershipDto> ActivateMembershipAsync(int membershipId);
        Task<List<MembershipDto>> GetMembershipsByUserIdAsync(int userId);
        Task<bool> IsMembershipActiveAsync(int userId);
    }
}
