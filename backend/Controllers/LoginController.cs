using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.Data;
using backend.Repository.Implementation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Models;
using backend.Services;
using backend.Repository.Interface;
using backend.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Google.Apis.Auth;
//using Google.Apis.Auth;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;
        private readonly IMapper _mapper;

        public LoginController(IUserRepository userRepository, JwtService jwtService, IMapper mapper)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userRepository.Login(loginDto);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new 
            { 
                token = token, 
                userID = user.Id, 
                userRole=user.UserType
            });
        }

        [HttpPost("validate-token")]
        public IActionResult ValidateToken()
        {
            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                if (identity == null || !identity.Claims.Any())
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid token"
                    });
                }

                var userClaims = identity.Claims;
                var userId = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                var email = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                var userType = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

                return Ok(new
                {
                    success = true,
                    message = "Token is valid",
                    data = new
                    {
                        userId,
                        email,
                        userType
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while validating the token",
                    error = ex.Message
                });
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                // Verify Google token
                var payload = await VerifyGoogleToken(request.Credential);
                if (payload == null)
                {
                    return BadRequest(new { message = "Invalid Google token" });
                }

                // Check if user exists, if not create new user
                var userDto = await _userRepository.GetUserByEmailAsync(payload.Email);
                if (userDto == null)
                {
                    // Create new user
                    var newUser = new User
                    {
                        Email = payload.Email,
                        FirstName = payload.GivenName,
                        LastName = payload.FamilyName,
                        UserType = "Customer",
                        Status = "active",
                        CreatedAt = DateTime.Now
                    };

                    var createdUser = await _userRepository.CreateUser(newUser);
                    if (createdUser == null)
                    {
                        return StatusCode(500, new { message = "Failed to create user" });
                    }
                    userDto = _mapper.Map<UserDto>(createdUser);
                }
                userDto = await _userRepository.GetUserByEmailAsync(payload.Email);
                // Generate JWT token
                var token = _jwtService.GenerateToken(userDto);

                return Ok(new
                {
                    token,
                    userID=userDto.Id,
                    userRole=userDto.UserType
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred during Google login",
                    error = ex.Message
                });
            }
        }

        private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { "157843865023-45o3ncemhfk5n348ee0kdrmn9cq02u9b.apps.googleusercontent.com" }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
    }

    // public class GoogleLoginRequest
    // {
    //     public string Credential { get; set; }
    // }
}