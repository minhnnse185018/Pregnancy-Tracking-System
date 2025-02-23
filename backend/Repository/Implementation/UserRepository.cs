using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public UserRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserDto?> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || user.Password != loginDto.Password) // TODO: Use password hashing
            {
                return null;
            }

            if (user.Status.ToLower() != "active")
            {
                return null;
            }

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> IsEmailExists(string email)
        {
            return await _context.Users
                .AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> CreateUser(User user)
        {
            if (await IsEmailExists(user.Email))
            {
                return null;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<int> UpdateUser(int id, User user)
        {
            try
            {
                var existUser = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (existUser == null) return 0;

                user.Id = id;
                _context.Entry(existUser).CurrentValues.SetValues(user);
                _context.Entry(existUser).Property(x => x.Password).IsModified = false;
                _context.Entry(existUser).State = EntityState.Modified;

                return await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return -1;
            }
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .OrderBy(u => u.FirstName)
                .ToListAsync();

            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<List<UserDto>> GetFilteredUsersAsync(string? role = null, string? status = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(u => u.UserType == role);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(u => u.Status == status);
            }

            var users = await query
                .OrderBy(u => u.FirstName)
                .ToListAsync();

            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<int> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            _context.Users.Remove(user);
            return await _context.SaveChangesAsync();

        }
    }
}