using backend.Dtos.Payment;

namespace backend.Services.Interface
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentRequestDto model, HttpContext context);
        PaymentResponseDto PaymentExecute(IQueryCollection collections);

    }
}
