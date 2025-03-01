using backend.Dtos.MembershipPlans;
using backend.Dtos.Memberships;

namespace backend.Repository.Interface
{
    public interface IMembershipPlanRepository
    {
        Task<List<MembershipPlanDto>> GetAllPlansAsync();
        Task<MembershipPlanDto?> GetPlanByIdAsync(int id);
<<<<<<< HEAD
        Task<int> CreatePlanAsync(CreateMembershipPlanDto planDto);
        Task<MembershipPlanDto?> UpdatePlanAsync(int id, UpdateMembershipPlanDto planDto);
        Task<int> DeletePlanAsync(int id);
=======
        Task<MembershipPlanDto> CreatePlanAsync(CreateMembershipPlanDto planDto);
        Task<MembershipPlanDto?> UpdatePlanAsync(int id, UpdateMembershipPlanDto planDto);
        Task<bool> DeletePlanAsync(int id);
>>>>>>> origin/truong-son
        Task<List<MembershipPlanDto>> GetActivePlansAsync();
    }
} 