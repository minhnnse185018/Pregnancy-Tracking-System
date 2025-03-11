using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // Liên kết với Users

        [Required]
        public int MembershipId { get; set; } // Liên kết với Memberships

        [Required]
        public decimal Amount { get; set; } // Số tiền thanh toán

        public string PaymentDescription { get; set; } = string.Empty; // Mô tả thanh toán

        [Required]
        public string PaymentMethod { get; set; } = string.Empty; // Phương thức thanh toán (VNPay, Visa, MasterCard, ...)

        public string? VnpayToken { get; set; } // Mã token giao dịch VNPay

        public string? VnpayTransactionNo { get; set; } // Mã giao dịch do VNPay cung cấp

        public string? VnpayResponseCode { get; set; } // Mã phản hồi từ VNPay

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow; // Ngày thanh toán

        [Required]
        public string PaymentStatus { get; set; } = "Pending"; // Trạng thái thanh toán (Pending, Success, Failed)

        // Khóa ngoại
        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("MembershipId")]
        public Membership Membership { get; set; }
    }
}
