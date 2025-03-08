namespace backend.Dtos.Payment
{
    public class CreatePaymentDTO
    {
        public string PaymentMethod { get; set; }
        public double Amount { get; set; }
        public string PaymentDescription { get; set; }


    }
}
