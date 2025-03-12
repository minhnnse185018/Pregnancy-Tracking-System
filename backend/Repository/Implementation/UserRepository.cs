using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public UserRepository(ApplicationDBContext context, IMapper mapper, IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;

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

        public async Task<int> Register(RegisterRequest register)
        {
            try 
            {
                if (await IsEmailExists(register.Email))
                {
                    return -1;
                }

                var user = _mapper.Map<User>(register);
                
                // Set default values
                user.CreatedAt = DateTime.Now;
                user.Status = "active";
                user.UserType = "1";

                // Explicitly set Phone and DateOfBirth
                if (!string.IsNullOrWhiteSpace(register.Phone))
                {
                    user.Phone = register.Phone.Trim();
                }
                if (register.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = register.DateOfBirth.Value;
                }

                await _context.Users.AddAsync(user);
                return await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                return 0;
            }
        }

        public async Task<int> UpdateUserInfo(UpdateUserInfoDto userDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(userDto.Id);
                if (user == null) return -1;

                // Update basic info
                if (!string.IsNullOrWhiteSpace(userDto.FirstName)) user.FirstName = userDto.FirstName;
                if (!string.IsNullOrWhiteSpace(userDto.LastName)) user.LastName = userDto.LastName;
                if (!string.IsNullOrWhiteSpace(userDto.Gender)) user.Gender = userDto.Gender;
                

                // Explicitly update Phone
                if (userDto.Phone != null)
                {
                    user.Phone = string.IsNullOrWhiteSpace(userDto.Phone) ? null : userDto.Phone.Trim();
                }

                // Explicitly update DateOfBirth
                if (userDto.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = userDto.DateOfBirth.Value;
                }

                _context.Entry(user).State = EntityState.Modified;
                return await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Update error: {ex.Message}");
                return -1;
            }
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return false;
            }
            string newPassword = GenerateRandomPassword(6);
            user.Password = newPassword;
            await _context.SaveChangesAsync();
            await _emailService.SendEmailAsync(user.Email, "Password Reset", $"Your new password is: {newPassword}");
            return true;
        }

        private string GenerateRandomPassword(int length)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            Random random = new Random();
            return new string(Enumerable.Repeat(validChars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}