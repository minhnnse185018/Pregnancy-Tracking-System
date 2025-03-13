using System;
using System.Collections.Generic;
using System.Linq;
using backend.Dtos;
using backend.Dtos.Payment;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : Controller
    {

        private readonly IVnPayService _vnPayService;
        public PaymentController(IVnPayService vnPayService)
        {

            _vnPayService = vnPayService;
        }
        [HttpPost]
        public IActionResult CreatePaymentUrlVnpay(PaymentRequestDto model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Ok(url);
        }
        [HttpGet]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            return Json(response);
        }

        [HttpGet("return")]
        public IActionResult PaymentCallback()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (response.VnpayResponseCode == "00") // 00 = Thành công
            {
                return Ok(new
                {
                    transactionId = response.VnpayTransactionNo,
                    amount = response.Amount,
                    membershipId = response.MembershipId,
                    paymentDescription = response.PaymentDescription,
                    paymentMethod = "VNPay",
                    vnpayResponseCode = response.VnpayResponseCode,
                    paymentStatus = "Sucess!",
                    paymentDate = DateTime.UtcNow

                });
            }
            else
            {
                return BadRequest(new
                {
                    message = "Thanh toán thất bại!",
                    responseCode = response.VnpayResponseCode
                });
            }
        }


    }

}
