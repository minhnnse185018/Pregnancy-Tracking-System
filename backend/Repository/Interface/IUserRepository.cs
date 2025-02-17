using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IUserRepository
    {
        Task<User?> GetUser(string email, string Password);
    }
    
}