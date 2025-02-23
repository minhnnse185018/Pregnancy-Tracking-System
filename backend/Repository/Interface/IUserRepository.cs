using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IUserRepository
    {
        Task<UserDto?> Login(LoginDto loginDto);
        Task<bool> IsEmailExists(string email);
        Task<User?> CreateUser(User user);
        Task<int> UpdateUser(int id, User user);
        Task<int> DeleteUser(int id);
        Task<List<UserDto>> GetAllUsersAsync();
        Task<List<UserDto>> GetFilteredUsersAsync(string? role = null, string? status = null);
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> GetUserByEmailAsync(string email);
    }
    
}