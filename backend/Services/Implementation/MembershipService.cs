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
        private readonly IPaymentRepository _paymentRepository; // Thêm để lưu Payment
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
            // Kiểm tra xem người dùng có membership đang hoạt động không
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
                // Đổi Status thành "Expired"
                await _membershipRepository.UpdateMembershipAsync(membership.Id, "Expired");
            }
        }

        public async Task<MembershipDto> UpgradeMembershipAsync(int userId, int newPlanId)
        {
            // Kiểm tra membership hiện tại
            var currentMemberships = await _membershipRepository.GetMembershipsByUserIdAsync(userId);
            if (currentMemberships == null || !currentMemberships.Any())
                throw new Exception("No active membership found to upgrade.");

            var currentMembership = currentMemberships.First();
            var currentPlan = await _planRepository.GetPlanByIdAsync(currentMembership.PlanId);
            var newPlan = await _planRepository.GetPlanByIdAsync(newPlanId);

            if (currentPlan == null || newPlan == null)
                throw new Exception("Current or new plan not found");

            // Không cho phép nâng cấp lên gói thấp hơn hoặc cùng gói
            if (newPlan.Price <= currentPlan.Price)
                throw new Exception("You can only upgrade to a higher plan.");

            // Hủy gói hiện tại
            await _membershipRepository.UpdateMembershipAsync(currentMembership.Id, "Cancelled");

            // Tính số tiền cần thanh toán (hiệu số)
            var amountToPay = newPlan.Price - currentPlan.Price;

            // Tạo membership mới
            var newMembershipDto = new CreateMembershipDto
            {
                UserId = userId,
                PlanId = newPlanId,
                StartDate = DateTime.UtcNow
            };

            var newMembership = await CreatePendingMembershipAsync(newMembershipDto);

            // Tạo Payment với số tiền là hiệu số
            var payment = new Payment
            {
                MembershipId = newMembership.Id,
                Amount = amountToPay,
                PaymentDescription = $"Upgrade from {currentPlan.PlanName} to {newPlan.PlanName}",
                PaymentMethod = "VnPay",
                PaymentStatus = "Pending",
                PaymentDate = DateTime.UtcNow
            };

            // Lưu Payment
            await _paymentRepository.SavePaymentAsync(payment);

            return newMembership;
        }
    }
}