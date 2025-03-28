using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos
{
    public class UserDtoManager
    {
         public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string UserType { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        public string? Phone { get; set; }
        public string Status { get; set; } = "active";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}