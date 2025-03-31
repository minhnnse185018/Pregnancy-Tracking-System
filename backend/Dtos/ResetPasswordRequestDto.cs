using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos
{
    public class ResetPasswordRequestDto
    {
        
        public string Email { get; set; }

    
        public string Token { get; set; }

        
        public string NewPassword { get; set; }
    }
}