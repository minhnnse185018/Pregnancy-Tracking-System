using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos
{
    public class ChangePasswordRequestDto
    {
        public int Id { get; set; }
        public string Password { get; set; }
    }
}