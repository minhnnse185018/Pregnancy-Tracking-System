using backend.Dtos.Payment;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IPaymentRepository
    {
        string CreatePaymentUrl(CreatePaymentDTO model, HttpContext context);
        Payment PaymentExecute(IQueryCollection collections);
        Task<Payment> SavePaymentAsync(Payment payment);
    }
}
