using Azure.Core;
using backend.Dtos.Payment;
using backend.Repository.Implementation;
using backend.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : Controller
    {

        private readonly IPaymentRepository _paymentRepository;
        public PaymentController(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }


        [HttpPost]
        public IActionResult CreatePaymentUrlVnpay(CreatePaymentDTO model)
        {
            var url = _paymentRepository.CreatePaymentUrl(model, HttpContext);

            return Ok(url);
        }
        [HttpGet]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = _paymentRepository.PaymentExecute(Request.Query);

            return Json(response);
        }


    }
}
