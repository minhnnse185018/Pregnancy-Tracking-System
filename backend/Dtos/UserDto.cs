using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
<<<<<<< HEAD
using Newtonsoft.Json;
using backend.Helpers;
=======
>>>>>>> origin/truong-son

namespace backend.Dtos
{
    public class UserDto
    {
<<<<<<< HEAD
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string UserType { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly? DateOfBirth { get; set; }
        
        public string? Image { get; set; }
        public string? Phone { get; set; }
        public string Status { get; set; } = "active";
=======
        public int? Id { get; set; }
        public string? Email { get; set; } 
        public string? UserType { get; set; } 
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Status { get; set; } 
        public string? Password { get; set; } 
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Image { get; set; }
        public string? Phone { get; set; }
        
>>>>>>> origin/truong-son
    }
}