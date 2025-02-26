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
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<MembershipDto>>(memberships);
        }

        public async Task<int> CreateMembershipAsync(CreateMembershipDto membershipDto)
        {
            var membership = _mapper.Map<Membership>(membershipDto);
            membership.CreatedAt = DateTime.Now;

            _context.Memberships.Add(membership);
            

            return await _context.SaveChangesAsync();;
        }

        public async Task<MembershipDto?> UpdateMembershipAsync(int id, UpdateMembershipDto membershipDto)
        {
            var membership = await _context.Memberships.FindAsync(id);
            if (membership == null) return null;

            _mapper.Map(membershipDto, membership);
            await _context.SaveChangesAsync();

            return await GetMembershipByIdAsync(id);
        }

        public async Task<int> DeleteMembershipAsync(int id)
        {
            var membership = await _context.Memberships.FindAsync(id);
            if (membership == null) return -1;

            _context.Memberships.Remove(membership);
            
            return await _context.SaveChangesAsync();;
        }

        public async Task<bool> IsMembershipActiveAsync(int userId)
        {
            return await _context.Memberships
                .AnyAsync(m => m.UserId == userId 
                    && m.Status == "active" 
                    && m.EndDate > DateTime.Now);
        }
    }
} 