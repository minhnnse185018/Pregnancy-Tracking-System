using backend.Dtos.Memberships;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IMembershipRepository
    {
        Task<List<MembershipDto>> GetAllMembershipsAsync();
        Task<MembershipDto?> GetMembershipByIdAsync(int id);
        Task<List<MembershipDto>?> GetMembershipsByUserIdAsync(int userId);
        Task<int> CreateMembershipAsync(CreateMembershipDto membershipDto); // ?ây là ph??ng th?c c?
        Task<MembershipDto?> UpdateMembershipAsync(int id, string status);
        Task<int> DeleteMembershipAsync(int id);
        Task<int> ExtendMemberShipAsync(int id);
        Task<bool> IsMembershipActiveAsync(int userId);

        // Thêm các ph??ng th?c m?i ?? kh?p v?i MembershipService
        Task<Membership> AddAsync(Membership membership); // Thêm ph??ng th?c này
        Task<Membership> GetByIdAsync(int id); // ??m b?o có ph??ng th?c này
    }
}