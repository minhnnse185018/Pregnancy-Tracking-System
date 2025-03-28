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
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;

        public MembershipService(
            IMembershipRepository membershipRepository,
            IMembershipPlanRepository planRepository,
            IPaymentRepository paymentRepository,
            IMapper mapper)
        {
            _membershipRepository = membershipRepository;
            _planRepository = planRepository;
            _paymentRepository = paymentRepository;
            _mapper = mapper;
        }

        public async Task<MembershipDto> CreatePendingMembershipAsync(CreateMembershipDto membershipDto)
        {
            // Kiểm tra tất cả membership của người dùng
            var allMemberships = await _membershipRepository.GetAllMembershipsAsync();
            var userMemberships = allMemberships.Where(m => m.UserId == membershipDto.UserId).ToList();

            // Kiểm tra và cập nhật trạng thái nếu có membership hết hạn
            foreach (var existingMembership in userMemberships) 
            {
                if (existingMembership.Status == "Active" && existingMembership.EndDate <= DateTime.UtcNow)
                {
                    await _membershipRepository.UpdateMembershipAsync(existingMembership.Id, "Expired");
                }
            }

            // Kiểm tra lại xem người dùng có membership đang hoạt động không
            var isActive = await IsMembershipActiveAsync(membershipDto.UserId);
            if (isActive)
            {
                var currentMemberships = await _membershipRepository.GetMembershipsByUserIdAsync(membershipDto.UserId);
                var currentMembership = currentMemberships.First();
                var currentPlan = await _planRepository.GetPlanByIdAsync(currentMembership.PlanId);
                var newPlan = await _planRepository.GetPlanByIdAsync(membershipDto.PlanId);

                if (currentPlan == null || newPlan == null)
                    throw new Exception("Current or new plan not found");

                // Không cho phép mua gói thấp hơn hoặc cùng gói
                if (newPlan.Price <= currentPlan.Price)
                    throw new Exception("You cannot purchase this plan or a lower plan while your current plan is active.");
            }

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
                await _membershipRepository.UpdateMembershipAsync(membership.Id, "Expired");
            }
        }

        public async Task<MembershipDto> UpgradeMembershipAsync(int userId, int newPlanId)
        {
            var currentMemberships = await _membershipRepository.GetMembershipsByUserIdAsync(userId);
            if (currentMemberships == null || !currentMemberships.Any())
                throw new Exception("No active membership found to upgrade.");

            var currentMembership = currentMemberships.First();
            var currentPlan = await _planRepository.GetPlanByIdAsync(currentMembership.PlanId);
            var newPlan = await _planRepository.GetPlanByIdAsync(newPlanId);

            if (currentPlan == null || newPlan == null)
                throw new Exception("Current or new plan not found");

            if (newPlan.Price <= currentPlan.Price)
                throw new Exception("You can only upgrade to a higher plan.");

            await _membershipRepository.UpdateMembershipAsync(currentMembership.Id, "Cancelled");

            var amountToPay = newPlan.Price - currentPlan.Price;

            var newMembershipDto = new CreateMembershipDto
            {
                UserId = userId,
                PlanId = newPlanId,
                StartDate = currentMembership.StartDate
            };

            var newMembership = await CreatePendingMembershipAsync(newMembershipDto);

            var payment = new Payment
            {
                MembershipId = newMembership.Id,
                Amount = amountToPay,
                PaymentDescription = $"Upgrade from {currentPlan.PlanName} to {newPlan.PlanName}",
                PaymentMethod = "VnPay",
                PaymentStatus = "Pending",
                PaymentDate = DateTime.UtcNow
            };

            await _paymentRepository.SavePaymentAsync(payment);

            return newMembership;
        }
    }
}