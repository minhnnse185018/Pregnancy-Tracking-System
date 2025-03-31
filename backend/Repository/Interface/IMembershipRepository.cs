using backend.Dtos.Memberships;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IMembershipRepository
    {
        Task<List<MembershipDto>> GetAllMembershipsAsync();
        Task<MembershipDto?> GetMembershipByIdAsync(int id);
        Task<List<MembershipDto>?> GetMembershipsByUserIdAsync(int userId);
        Task<int> CreateMembershipAsync(CreateMembershipDto membershipDto);
        Task<MembershipDto?> UpdateMembershipAsync(int id, string status);
        Task<int> DeleteMembershipAsync(int id);
        Task<int> ExtendMemberShipAsync(int id);
        Task<bool> IsMembershipActiveAsync(int userId);
        Task<Membership> AddAsync(Membership membership);
        Task<Membership> GetByIdAsync(int id);
    }
}