using Newtonsoft.Json;
using backend.Helpers;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string UserType { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly? DateOfBirth { get; set; }
        public string? Image { get; set; }
        public string? Phone { get; set; }
        public string Status { get; set; } = "active";
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public virtual ICollection<PregnancyProfile>? PregnancyProfiles { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<Membership> Memberships { get; set; } = new List<Membership>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
} 