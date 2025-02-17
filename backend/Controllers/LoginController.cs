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

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController:ControllerBase
    {
        private readonly UserRepository _userRepo;
        private readonly ApplicationDBContext _context;
        public LoginController(UserRepository userRepo,ApplicationDBContext context)
        {
            _context=context;
            _userRepo=userRepo;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(string email,string Password)
        {
            var user= await _userRepo.GetUser(email,Password);
            if(user==null){
                return BadRequest("Invalid user or password!");
            }
            var claims= new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.UserId.ToString()),
                new Claim(ClaimTypes.Name,user.Username),
                new Claim("RoleId",user.RoleId),
            };
            if(user.RoleId=="MANAGER")
            {
                var manager = await _context.Managers.FirstOrDefaultAsync(x=>x.UserId==user.UserId);
                if(manager!=null)
                {
                    claims.Add(new Claim("ManagerId",manager.ManagerId.ToString()));
                    claims.Add(new Claim("ManagerFirstName",manager.FirstName));
                    claims.Add(new Claim("ManagerLastName",manager.LastName));
                }
            }
            else if(user.RoleId=="MEMBER")
            {
                var member = await _context.Members.FirstOrDefaultAsync(x=>x.UserId==user.UserId);
                if(member!=null)
                {
                    claims.Add(new Claim("MemberId",member.MemberId.ToString()));
                    claims.Add(new Claim("MemberFirstName",member.FirstName));
                    claims.Add(new Claim("MemberLastName",member.LastName));
                }
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_secret_key_here"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    issuer: "your_issuer_here",
                    audience: "your_audience_here",
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });

        }
    }
}