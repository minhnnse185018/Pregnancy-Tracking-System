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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                

                
                var result = await _userRepository.Register(request);
                if (result > 0)
                {
                    // Get the registered user
                    var user = await _userRepository.GetUserByEmailAsync(request.Email);
                    if (user != null)
                    {
                        // Generate token
                        var token = _jwtService.GenerateToken(user);
                        return Ok(new 
                        { token,
                            userID=user.Id,
                            userRole=user.UserType
                         });
                    }
                }

                return BadRequest(new { message = "Registration failed" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Credential))
                {
                    return BadRequest(new { message = "Google credential is required" });
                }

                // Get user info from token
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(request.Credential) as JwtSecurityToken;
                
                if (jsonToken == null)
                {
                    return BadRequest(new { message = "Invalid token format" });
                }

                var email = jsonToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;
                var firstName = jsonToken.Claims.FirstOrDefault(claim => claim.Type == "given_name")?.Value;
                var lastName = jsonToken.Claims.FirstOrDefault(claim => claim.Type == "family_name")?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest(new { message = "Email not found in token" });
                }

                // Check if user exists
                var userDto = await _userRepository.GetUserByEmailAsync(email);
                
                if (userDto == null)
                {
                    // Create new user
                    var newUser = new User
                    {
                        Email = email,
                        FirstName = firstName ?? "",
                        LastName = lastName ?? "",
                        UserType = "Customer",
                        Status = "active",
                        CreatedAt = DateTime.Now,
                        Password = "" // Set empty password for Google users
                    };

                    var createdUser = await _userRepository.CreateUser(newUser);
                    if (createdUser == null)
                    {
                        return StatusCode(500, new { message = "Failed to create user" });
                    }
                    
                }
                userDto = await _userRepository.GetUserByEmailAsync(email);
                // Generate JWT token
                var token = _jwtService.GenerateToken(userDto);

                return Ok(new
                {
                    token = token,
                    user = userDto.Id,
                    userRole= userDto.UserType
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google login error: {ex}");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        public class GoogleLoginRequest
        {
            public string? Credential { get; set; }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    

    
}