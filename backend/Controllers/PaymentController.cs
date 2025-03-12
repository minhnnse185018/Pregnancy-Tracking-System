using System;
using System.Collections.Generic;
using System.Linq;
using backend.Dtos;
using backend.Dtos.Payment;
using backend.Models;
using backend.Data;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : Controller
    {

        private readonly IVnPayService _vnPayService;
        private readonly ApplicationDBContext _context;
        public PaymentController(IVnPayService vnPayService, ApplicationDBContext context)
        {

            _vnPayService = vnPayService;
            _context = context;
        }
        [HttpPost]
        public IActionResult CreatePaymentUrlVnpay(PaymentRequestDto model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Ok(url);
        }
        // [HttpGet]
        // public async Task<IActionResult> PaymentCallbackVnpay()
        // {
        //     var response = _vnPayService.PaymentExecute(Request.Query);

        //     // Kiểm tra nếu có lỗi khi thanh toán
        //     bool isSuccess = response.PaymentStatus == "Success";

        //     // Tạo đối tượng Payment để lưu vào database
        //     var payment = new Payment
        //     {
        //         UserId = response.UserId,
        //         MembershipId = response.MembershipId,
        //         Amount = response.Amount,
        //         PaymentDescription = response.PaymentDescription,
        //         PaymentMethod = response.PaymentMethod,
        //         VnpayToken = response.VnpayToken,
        //         VnpayTransactionNo = response.VnpayTransactionNo,
        //         VnpayResponseCode = response.VnpayResponseCode,
        //         PaymentDate = DateTime.UtcNow,
        //         PaymentStatus = isSuccess ? "Success" : "Failed"
        //     };

        //     // Lưu vào database
        //     await _context.Payments.AddAsync(payment);
        //     await _context.SaveChangesAsync();

        //     return Json(response);
        // }


    }

}
