using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;


namespace backend.Dtos
{
    public class UpdateUserInfoDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        public string? Image { get; set; }
        public string? Phone { get; set; }
    }
}