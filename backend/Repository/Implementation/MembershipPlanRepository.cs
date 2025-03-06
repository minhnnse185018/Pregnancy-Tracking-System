using AutoMapper;
using backend.Data;
using backend.Dtos.MembershipPlans;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class MembershipPlanRepository : IMembershipPlanRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public MembershipPlanRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<MembershipPlanDto>> GetAllPlansAsync()
        {
            var plans = await _context.MembershipPlans
                .OrderBy(p => p.Price)
                .ToListAsync();

            return _mapper.Map<List<MembershipPlanDto>>(plans);
        }

        public async Task<MembershipPlanDto?> GetPlanByIdAsync(int id)
        {
            var plan = await _context.MembershipPlans
                .FirstOrDefaultAsync(p => p.Id == id);

            return plan == null ? null : _mapper.Map<MembershipPlanDto>(plan);
        }

        public async Task<int> CreatePlanAsync(CreateMembershipPlanDto planDto)
        {
            var plan = _mapper.Map<MembershipPlan>(planDto);
            _context.MembershipPlans.Add(plan);
            return await _context.SaveChangesAsync();
        }

        public async Task<MembershipPlanDto?> UpdatePlanAsync(int id, UpdateMembershipPlanDto planDto)
        {
            var plan = await _context.MembershipPlans.FindAsync(id);
            if (plan == null) return null;

            _mapper.Map(planDto, plan);
            await _context.SaveChangesAsync();

            return _mapper.Map<MembershipPlanDto>(await _context.MembershipPlans.FindAsync(id));
        }

        public async Task<int> DeletePlanAsync(int id)
        {
            var plan = await _context.MembershipPlans.FindAsync(id);
            if (plan == null) return -1;

            _context.MembershipPlans.Remove(plan);
            return await _context.SaveChangesAsync();
        }
    }
} 