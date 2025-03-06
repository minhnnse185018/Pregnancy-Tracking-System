using backend.Dtos.MembershipPlans;



namespace backend.Repository.Interface
{
    public interface IMembershipPlanRepository
    {
        Task<List<MembershipPlanDto>> GetAllPlansAsync();
        Task<MembershipPlanDto?> GetPlanByIdAsync(int id);
        Task<int> CreatePlanAsync(CreateMembershipPlanDto planDto);
        Task<MembershipPlanDto?> UpdatePlanAsync(int id, UpdateMembershipPlanDto planDto);
        Task<int> DeletePlanAsync(int id);
    }
} 