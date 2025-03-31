using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Payment
{
    public class PaymentRequestDto
    {
        public int MembershipId { get; set; } // Liên kết với Memberships
        public decimal Amount { get; set; } // Số tiền thanh toán
        public string PaymentDescription { get; set; } = string.Empty; // Mô tả thanh toán
    }
}
