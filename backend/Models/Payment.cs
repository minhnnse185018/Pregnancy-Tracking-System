namespace backend.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MembershipId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string? VnpayToken { get; set; }
        public string? VnpayTransactionNo { get; set; }
        public string? VnpayResponseCode { get; set; }
        public DateTime PaymentsDate { get; set; } = DateTime.Now;
        public DateTime? VnpayPayDate { get; set; }
        public string PaymentStatus { get; set; } = "pending";

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Membership Membership { get; set; } = null!;
    }
} 