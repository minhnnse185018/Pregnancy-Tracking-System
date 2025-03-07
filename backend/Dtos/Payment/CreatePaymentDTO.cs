namespace backend.Dtos.Payment
{
    public class CreatePaymentDTO
    {
        public double Amount { get; set; }
        public string PaymentMethod { get; set; }
    }
}
