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

        public async Task<List<UserDtoManager>> GetFilteredUsersAsync(string? role = null, string? status = null)
        {
            var query = _context.Users.AsQueryable();

            // Exclude users with UserType 3 and 4
            query = query.Where(u => u.UserType != "3" && u.UserType != "4");

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

            return _mapper.Map<List<UserDtoManager>>(users);
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

        public async Task<bool> Register(RegisterRequest register)
        {
            try 
            {
                if (await IsEmailExists(register.Email))
                {
                    return false;
                }

                var user = _mapper.Map<User>(register);
                
                user.CreatedAt = DateTime.Now;
                user.Status = "inactive"; 
                user.UserType = "1";
                string verificationToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
                user.ResetToken = verificationToken;
                user.ResetTokenExpired = DateTime.UtcNow.AddHours(2); 

                if (!string.IsNullOrWhiteSpace(register.Phone))
                {
                    user.Phone = register.Phone.Trim();
                }
                if (register.DateOfBirth.HasValue)
                {
                    user.DateOfBirth = register.DateOfBirth.Value;
                }

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                // Send verification email
                var verificationLink = $"http://localhost:3000/verify-account?token={Uri.EscapeDataString(verificationToken)}&email={Uri.EscapeDataString(register.Email)}";
                var subject = "Account Verification - Pregnancy Tracking System";
                var body = $@"
<html>
<body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
        <h1 style='color: #ff69b4; text-align: center;'>Welcome to Pregnancy Tracking System!</h1>
        <p style='font-size: 16px; line-height: 1.5;'>Thank you for registering with us. To complete your registration, please verify your account by clicking the button below:</p>
        <div style='text-align: center; margin: 30px 0;'>
            <a href='{verificationLink}' style='background-color: #ff69b4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Verify Account</a>
        </div>
        <p style='font-size: 14px; color: #666;'>This verification link will expire in 2 hours.</p>
        <p style='font-size: 14px; color: #666;'>If you didn't create an account, please ignore this email.</p>
    </div>
</body>
</html>";
                
                await _emailService.SendEmailAsync(register.Email, subject, body);
                
                return true; // Return the user ID
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                return false;
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
            await _emailService.SendEmailAsync(user.Email, "Your New Password - Pregnancy Tracking System", $@"
<html>
<body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
        <h1 style='color: #ff69b4; text-align: center;'>Password Reset</h1>
        <p style='font-size: 16px; line-height: 1.5;'>Your password has been reset. Here's your new password:</p>
        <div style='text-align: center; margin: 30px 0; padding: 15px; background-color: #f8f8f8; border-radius: 5px;'>
            <code style='font-size: 20px; font-weight: bold; color: #ff69b4;'>{newPassword}</code>
        </div>
        <p style='font-size: 14px; color: #666;'>For security reasons, please change this password after logging in.</p>
        <p style='font-size: 14px; color: #666;'>If you didn't request a password reset, please contact support immediately.</p>
    </div>
</body>
</html>");
            return true;
        }

        private string GenerateRandomPassword(int length)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            Random random = new Random();
            return new string(Enumerable.Repeat(validChars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

     
         public async Task<bool> ChangePasswordAsync(ChangePasswordRequestDto changePasswordRequestDto)
         {
             var user= await _context.Users.FirstOrDefaultAsync(x=>x.Id==changePasswordRequestDto.Id);
             user.Password=changePasswordRequestDto.Password;
             await _context.SaveChangesAsync();
             return true;
 
         }
 
         public async Task<bool> ForgotPasswordRequestAsync(ForgotPasswordRequestDto forgotPasswordRequestDto)
         {
             var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordRequestDto.Email);
             if (user == null)
             {
                 return false; 
             }
             string resetToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
             user.ResetToken = resetToken;
             user.ResetTokenExpired = DateTime.UtcNow.AddMinutes(10);
             await _context.SaveChangesAsync();
             var resetlink= $"http://localhost:3000/reset-password?token={Uri.EscapeDataString(resetToken)}&email={Uri.EscapeDataString(forgotPasswordRequestDto.Email)}";
             var subject = "Password Reset Request - Pregnancy Tracking System";
             var body = $@"
<html>
<body style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
        <h1 style='color: #ff69b4; text-align: center;'>Reset Your Password</h1>
        <p style='font-size: 16px; line-height: 1.5;'>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style='text-align: center; margin: 30px 0;'>
            <a href='{resetlink}' style='background-color: #ff69b4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Reset Password</a>
        </div>
        <p style='font-size: 14px; color: #666;'>This link will expire in 10 minutes.</p>
        <p style='font-size: 14px; color: #666;'>If you didn't request a password reset, please ignore this email.</p>
    </div>
</body>
</html>";
             
             await _emailService.SendEmailAsync(user.Email, subject, body);
             return true;
 
         }
 
         public async Task<bool> ResetPasswordRequest(ResetPasswordRequestDto resetPasswordRequestDto)
         {
             var user = await _context.Users.FirstOrDefaultAsync(u => 
             u.Email == resetPasswordRequestDto.Email &&
             u.ResetToken == resetPasswordRequestDto.Token &&
             u.ResetTokenExpired > DateTime.UtcNow);
             
         if (user == null)
         {
             return false;
         }
         
         // Update password
         user.Password = resetPasswordRequestDto.NewPassword; // Ideally this should be hashed
         user.ResetToken = null;
         user.ResetTokenExpired = null;
         
         await _context.SaveChangesAsync();
         return true;
         }

        public async Task<bool> VerifyRegistration(string email, string token)
        {
            // First, check if there's a pending user with this email
            var user = await _context.Users.FirstOrDefaultAsync(u => 
                u.Email == email && 
                u.Status.ToLower() == "inactive");
                
            if (user == null)
            {
                return false;
            }
            
            // If token is valid and not expired
            if (user.ResetToken == token && user.ResetTokenExpired > DateTime.UtcNow) 
            {
                // Activate the account
                user.Status = "active";
                user.ResetToken = null;
                user.ResetTokenExpired = null;
                
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                // Token is invalid or expired - delete the unverified account
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return false;
            }
        }
    }
}