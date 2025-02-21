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
        Task<User?> GetUserByEmail(string email);
        Task<bool> IsEmailExists(string email);
        Task<User> CreateUser(User user);
        Task<User?> GetUserById(int id);
        Task<bool> UpdateUser(User user);
        Task<IEnumerable<User>> GetAllUsers();
    }
    
}