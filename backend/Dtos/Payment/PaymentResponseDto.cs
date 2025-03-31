using backend.Models;

namespace backend.Dtos.Payment
{
    public class PaymentResponseDto
    {
        public int Id { get; set; } // ID thanh toán
        public int MembershipId { get; set; } // Liên kết với Memberships
        public decimal Amount { get; set; } // Số tiền thanh toán
        public string PaymentDescription { get; set; } = string.Empty; // Mô tả thanh toán
        public string PaymentMethod { get; set; } = string.Empty; // Phương thức thanh toán

        public Decimal? PayementAmount { get; set; } // Số tiền thanh toán
        public string? VnpayToken { get; set; } // Mã token giao dịch VNPay
        public string? VnpayTransactionNo { get; set; } // Mã giao dịch do VNPay cung cấp
        public string? VnpayResponseCode { get; set; } // Mã phản hồi từ VNPay
        public DateTime PaymentDate { get; set; } // Ngày thanh toán
        public string PaymentStatus { get; set; } = "Pending"; // Trạng thái thanh toán

    }
}
