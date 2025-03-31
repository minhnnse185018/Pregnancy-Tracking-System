using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Membership")]
        public int MembershipId { get; set; } // Liên kết với Memberships

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be positive")]
        public decimal Amount { get; set; } // Số tiền thanh toán

        public string PaymentDescription { get; set; } = string.Empty; // Mô tả thanh toán

        [Required]
        public string PaymentMethod { get; set; } = "VnPay";

        public string? VnpayToken { get; set; } // Mã token giao dịch VNPay

        public string? VnpayTransactionNo { get; set; } // Mã giao dịch do VNPay cung cấp

        public string? VnpayResponseCode { get; set; } // Mã phản hồi từ VNPay

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow; // Ngày thanh toán

        [Required]
        public string PaymentStatus { get; set; } = "Pending"; // Trạng thái thanh toán (Pending, Success, Failed)


        // Khóa ngoại
        public virtual Membership Membership { get; set; } = null;
    }
}
