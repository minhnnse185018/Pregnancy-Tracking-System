using AutoMapper;
using backend.Dtos.Memberships;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;

namespace backend.Services.Implementation
{
    public class MembershipService : IMembershipService
    {
        private readonly IMembershipRepository _membershipRepository;
        private readonly IMembershipPlanRepository _planRepository;
        private readonly IMapper _mapper;

        public MembershipService(
            IMembershipRepository membershipRepository,
            IMembershipPlanRepository planRepository,
            IMapper mapper)
        {
            _membershipRepository = membershipRepository;
            _planRepository = planRepository;
            _mapper = mapper;
        }

        public async Task<MembershipDto> CreatePendingMembershipAsync(CreateMembershipDto membershipDto)
        {
            var plan = await _planRepository.GetPlanByIdAsync(membershipDto.PlanId);
            if (plan == null)
                throw new Exception("Membership plan not found");

            var membership = new Membership
            {
                UserId = membershipDto.UserId,
                PlanId = membershipDto.PlanId,
                StartDate = membershipDto.StartDate,
                EndDate = membershipDto.StartDate.AddMonths(plan.Duration),
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            var createdMembership = await _membershipRepository.AddAsync(membership);
            return _mapper.Map<MembershipDto>(createdMembership);
        }

        public async Task<MembershipDto> ActivateMembershipAsync(int membershipId)
        {
            var membership = await _membershipRepository.GetByIdAsync(membershipId);
            if (membership == null)
                throw new Exception("Membership not found");
            if (membership.Status != "Pending")
                throw new Exception("Membership is not in Pending state");

            membership.Status = "Active";
            await _membershipRepository.UpdateMembershipAsync(membershipId, membership.Status);
            return _mapper.Map<MembershipDto>(membership);
        }

        public async Task<List<MembershipDto>> GetMembershipsByUserIdAsync(int userId)
        {
            var memberships = await _membershipRepository.GetMembershipsByUserIdAsync(userId);
            return memberships ?? new List<MembershipDto>();
        }

        public async Task<bool> IsMembershipActiveAsync(int userId)
        {
            return await _membershipRepository.IsMembershipActiveAsync(userId);
        }
        public async Task CleanupExpiredMembershipsAsync()
        {
            var memberships = await _membershipRepository.GetAllMembershipsAsync();
            var expiredMemberships = memberships.Where(m => m.Status == "Active" && m.EndDate <= DateTime.UtcNow);

            foreach (var membership in expiredMemberships)
            {
                await _membershipRepository.DeleteMembershipAsync(membership.Id);
            }
        }
    }
}