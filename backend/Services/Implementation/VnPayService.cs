<<<<<<<< HEAD:backend/Services/Implementation/VnPayService.cs
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using backend.Dtos.Payment;
using backend.Services.Interface;
========
﻿using AutoMapper;
using backend.Dtos.Payment;
using backend.Mapper;
using backend.Models;
using backend.Repository.Interface;
>>>>>>>> 65f6572b5dbe8740d7b348d7f29247296fb468de:backend/Repository/Implementation/PaymentRepository.cs
using PregnancyTrackingSystem.Libraries;

namespace backend.Services.Implementation
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

<<<<<<<< HEAD:backend/Services/Implementation/VnPayService.cs
        public VnPayService(IConfiguration configuration)
========
        public PaymentRepository(IConfiguration configuration, IMapper mapper)
>>>>>>>> 65f6572b5dbe8740d7b348d7f29247296fb468de:backend/Repository/Implementation/PaymentRepository.cs
        {
            _configuration = configuration;
            _mapper=mapper;
        }
        public string CreatePaymentUrl(PaymentRequestDto model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();
            var urlCallBack = _configuration["Vnpay:PaymentBackReturnUrl"];

            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", $"{model.PaymentMethod} {model.PaymentDescription} {model.Amount}");
            pay.AddRequestData("vnp_OrderType", "other");
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", tick);

            var paymentUrl =
                pay.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

            return paymentUrl;
        }
        public PaymentResponseDto PaymentExecute(IQueryCollection collections)
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);
            
            return _mapper.Map<Payment>(response);
        }


    }
}
