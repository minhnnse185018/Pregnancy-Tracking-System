using backend.Dtos.Memberships;

namespace backend.Repository.Interface
{
    public interface IMembershipRepository
    {
        Task<List<MembershipDto>> GetAllMembershipsAsync();
        Task<MembershipDto?> GetMembershipByIdAsync(int id);
<<<<<<< HEAD
        Task<List<MembershipDto>?> GetMembershipsByUserIdAsync(int userId);
        Task<int> CreateMembershipAsync(CreateMembershipDto membershipDto);
        Task<MembershipDto?> UpdateMembershipAsync(int id, string Status);
        Task<int> DeleteMembershipAsync(int id);
        Task<int> ExtendMemberShipAsync(int id);
=======
        Task<List<MembershipDto>> GetMembershipsByUserIdAsync(int userId);
        Task<MembershipDto> CreateMembershipAsync(CreateMembershipDto membershipDto);
        Task<MembershipDto?> UpdateMembershipAsync(int id, UpdateMembershipDto membershipDto);
        Task<bool> DeleteMembershipAsync(int id);
>>>>>>> origin/truong-son
        Task<bool> IsMembershipActiveAsync(int userId);
    }
} 