using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Manager
    {
        public int ManagerId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Images { get; set; }
        public int UserId { get; set; }
        public string? Phone { get; set; }

        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}