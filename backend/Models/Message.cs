using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public int DoctorId { get; set; }
        public string? Content { get; set; }
        public string? Image { get; set; }
        public bool Sender { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual User Member { get; set; } = null!;
        public virtual User Doctor { get; set; } = null!;
    }
}