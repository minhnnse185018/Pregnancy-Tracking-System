using AutoMapper;
using backend.Data;
using backend.Dtos.Memberships;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class MembershipRepository : IMembershipRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public MembershipRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<MembershipDto>> GetAllMembershipsAsync()
        {
            var memberships = await _context.Memberships
                .Include(m => m.User)
                .Include(m => m.Plan)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
            return _mapper.Map<List<MembershipDto>>(memberships);
        }

        public async Task<MembershipDto?> GetMembershipByIdAsync(int id)
        {
            var membership = await _context.Memberships
                .Include(m => m.User)
                .Include(m => m.Plan)
                .FirstOrDefaultAsync(m => m.Id == id);
            return membership == null ? null : _mapper.Map<MembershipDto>(membership);
        }

        public async Task<List<MembershipDto>?> GetMembershipsByUserIdAsync(int userId)
        {
            var memberships = await _context.Memberships
                .Include(m => m.User)
                .Include(m => m.Plan)
                .Where(m => m.UserId == userId && m.Status == "Active")
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
            return _mapper.Map<List<MembershipDto>>(memberships);
        }

        public async Task<int> CreateMembershipAsync(CreateMembershipDto membershipDto)
        {
            try
            {
                var plan = await _context.MembershipPlans.FindAsync(membershipDto.PlanId);
                if (plan == null) return -1;

                var membership = _mapper.Map<Membership>(membershipDto);
                membership.EndDate = membershipDto.StartDate.AddMonths(plan.Duration);
                membership.Status = "Pending";
                membership.CreatedAt = DateTime.UtcNow;

                await _context.Memberships.AddAsync(membership);
                return await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return -1;
            }
        }

        public async Task<MembershipDto?> UpdateMembershipAsync(int id, string status)
        {
            try
            {
                var membership = await _context.Memberships.FindAsync(id);
                if (membership == null) return null;
                membership.Status = status;
                await _context.SaveChangesAsync();
                return await GetMembershipByIdAsync(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<int> DeleteMembershipAsync(int id)
        {
            var membership = await _context.Memberships.FindAsync(id);
            if (membership == null) return -1;
            _context.Memberships.Remove(membership);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> ExtendMemberShipAsync(int id)
        {
            var membership = await _context.Memberships.FindAsync(id);
            if (membership == null) return -1;
            var plan = await _context.MembershipPlans.FindAsync(membership.PlanId);
            if (plan == null) return -1;
            membership.Status = "Active";
            membership.StartDate = membership.EndDate;
            membership.EndDate = membership.StartDate.AddDays(plan.Duration * 7);
            return await _context.SaveChangesAsync();
        }

        public async Task<bool> IsMembershipActiveAsync(int userId)
        {
            return await _context.Memberships
                .AnyAsync(m => m.UserId == userId && m.Status == "Active" && m.EndDate > DateTime.UtcNow);
        }

        public async Task<Membership> AddAsync(Membership membership)
        {
            _context.Memberships.Add(membership);
            await _context.SaveChangesAsync();
            return membership;
        }

        public async Task<Membership> GetByIdAsync(int id)
        {
            return await _context.Memberships
                .Include(m => m.User)
                .Include(m => m.Plan)
                .FirstOrDefaultAsync(m => m.Id == id);
        }
    }
}