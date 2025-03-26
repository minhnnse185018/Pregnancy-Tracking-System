using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Dtos;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllAsync()
        { 
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }
        [HttpGet("GetByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            return user==null? NotFound():Ok(user);
        }
        [HttpGet("GetById/{id:int}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            return user==null? NotFound():Ok(user);
        }
        [HttpGet("FilterRSts")]
        public async Task<IActionResult> GetUserByFilter([FromQuery] string? role, [FromQuery] string? status)
        {
            var users = await _userRepository.GetFilteredUsersAsync(role,status);
            return users==null? NotFound():Ok(users);
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddUserAsync(User user)
        {
            
            await _userRepository.CreateUser(user);
            return  Ok();
        }
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateUserAsync(int id, UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            var result = await _userRepository.UpdateUser(id,user);
            return result>0? Ok():BadRequest();
        }
        [HttpPut("UpdateInfo")]
        public async Task<IActionResult> UpdateUserAsync( UpdateUserInfoDto infoDto)
        {
            
            var result = await _userRepository.UpdateUserInfo(infoDto);
            return result>0? Ok():BadRequest();
        }
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteUserAsync(int id)
        {
            
            var result = await _userRepository.DeleteUser(id);
            return result>0? Ok():BadRequest();
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var result = await _userRepository.ForgotPasswordAsync(email);
            if (!result)
            {
                return NotFound("Email not found.");
            }
            return Ok("A new password has been sent to your email.");
        }
        [HttpPost("forgotpassrequest")]
         public async Task<IActionResult> ForgotPasswordRequest([FromBody] ForgotPasswordRequestDto forgotPasswordRequestDto)
         {
             return await _userRepository.ForgotPasswordRequestAsync(forgotPasswordRequestDto)? Ok():NotFound();
         }
         [HttpPost("resetpassrequest")]
         public async Task<IActionResult> ResetPasswordRequest([FromBody] ResetPasswordRequestDto resetPasswordRequestDto)
         {
             return await _userRepository.ResetPasswordRequest(resetPasswordRequestDto)? Ok():NotFound();
         }
 
         [HttpPut("changepassword")]
         public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto changePasswordRequestDto)
         {
             
             var result = await _userRepository.ChangePasswordAsync(changePasswordRequestDto);
             return result? Ok():BadRequest();
         }
    }
}