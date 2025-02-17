using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;
        public UserRepository(ApplicationDBContext context)
        {
            _context=context;
        }

        public async Task<User?> GetUser(string email, string Password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u=>u.Username==email&&u.Password==Password);
            if(user==null)
            {
                return null;
            }
            return user;

        }
    }
}