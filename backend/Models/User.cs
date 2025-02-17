using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? RoleId { get; set; }
        public string? Status { get; set; }
        public DateTime? CreateDate { get; set; }

        // Navigation properties
        public virtual Manager? Manager { get; set; }
        public virtual Member? Member { get; set; }
    }
}