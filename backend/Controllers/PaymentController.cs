using System;
using System.Collections.Generic;
using System.Linq;
using backend.Data;
using backend.Dtos;
using backend.Dtos.Payment;
using backend.Models;
using backend.Services.Implementation;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IMembershipService _membershipService;
        private readonly ApplicationDBContext _context;

        public PaymentController(
            IVnPayService vnPayService,
            IMembershipService membershipService,
            ApplicationDBContext context)
        {
            _vnPayService = vnPayService;
            _membershipService = membershipService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePaymentUrlVnpay([FromBody] PaymentRequestDto model)
        {
            var membership = await _context.Memberships.FindAsync(model.MembershipId);
            if (membership == null)
                return NotFound("Membership không tồn tại.");

            if (membership.Status != "Pending")
                return BadRequest("Membership không ở trạng thái Pending.");

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(url);
        }

        [HttpGet("return")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (response.VnpayResponseCode == "00") // Giao dịch thành công
            {
                var membership = await _context.Memberships.FindAsync(response.MembershipId);
                if (membership == null)
                    return NotFound("Membership không tồn tại.");

                var newPayment = new Payment
                {
                    MembershipId = response.MembershipId,
                    Amount = response.Amount,
                    PaymentDescription = response.PaymentDescription,
                    PaymentMethod = response.PaymentMethod,
                    VnpayToken = response.VnpayToken,
                    VnpayTransactionNo = response.VnpayTransactionNo,
                    VnpayResponseCode = response.VnpayResponseCode,
                    PaymentDate = DateTime.UtcNow,
                    PaymentStatus = "Success"
                };

                _context.Payments.Add(newPayment);
                await _context.SaveChangesAsync();

                // Kích hoạt Membership
                var updatedMembership = await _membershipService.ActivateMembershipAsync(response.MembershipId);
                response.PaymentStatus = "Success";
            }
            else
            {
                response.PaymentStatus = "Failed";
            }

            // Sử dụng Ok() để trả về JSON
            return Ok(response);
        }
    }

}
