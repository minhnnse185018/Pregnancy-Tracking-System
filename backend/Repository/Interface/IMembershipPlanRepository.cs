using backend.Dtos.MembershipPlans;
using backend.Dtos.Memberships;

namespace backend.Repository.Interface
{
    public interface IMembershipPlanRepository
    {
        Task<List<MembershipPlanDto>> GetAllPlansAsync();
        Task<MembershipPlanDto?> GetPlanByIdAsync(int id);
        Task<MembershipPlanDto> CreatePlanAsync(CreateMembershipPlanDto planDto);
        Task<MembershipPlanDto?> UpdatePlanAsync(int id, UpdateMembershipPlanDto planDto);
        Task<bool> DeletePlanAsync(int id);
        Task<List<MembershipPlanDto>> GetActivePlansAsync();
    }
} 