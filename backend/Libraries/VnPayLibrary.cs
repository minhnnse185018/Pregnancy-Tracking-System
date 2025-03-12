using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Security.Cryptography;
using System.Globalization;
using backend.Models;
using backend.Dtos.Payment;

namespace PregnancyTrackingSystem.Libraries
{
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

        public PaymentResponseDto GetFullResponseData(IQueryCollection collection, string hashSecret)
        {
            Console.WriteLine("=== VNPay Callback Data ===");
            foreach (var (key, value) in collection)
            {
                Console.WriteLine($"Key: {key}, Value: {value}");
            }
            Console.WriteLine("==========================");

            var vnPay = new VnPayLibrary();
            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnPay.AddResponseData(key, value);
                }
            }

            var txnRef = vnPay.GetResponseData("vnp_TxnRef");
            if (string.IsNullOrEmpty(txnRef))
            {
                Console.WriteLine("Error: vnp_TxnRef is missing");
                throw new Exception("Invalid or missing vnp_TxnRef");
            }
            if (!long.TryParse(txnRef, out var orderId))
            {
                Console.WriteLine($"Error: vnp_TxnRef is invalid. Value: {txnRef}");
                throw new Exception("Invalid or missing vnp_TxnRef");
            }

            var transactionNo = vnPay.GetResponseData("vnp_TransactionNo");
            long vnPayTranId = 0;
            if (!string.IsNullOrEmpty(transactionNo) && long.TryParse(transactionNo, out var parsedTranId))
            {
                vnPayTranId = parsedTranId;
            }

            var vnpResponseCode = vnPay.GetResponseData("vnp_ResponseCode");
            var vnpSecureHash = collection.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value;
            var orderInfo = vnPay.GetResponseData("vnp_OrderInfo");
            var checkSignature = vnPay.ValidateSignature(vnpSecureHash, hashSecret);

            if (!checkSignature)
            {
                return new PaymentResponseDto()
                {
                    PaymentStatus = "fail"
                };
            }

            return new PaymentResponseDto()
            {
                PaymentStatus = "Success",
                PaymentMethod = "VnPay",
                PaymentDescription = orderInfo,
                MembershipId = (int)orderId,
                VnpayTransactionNo = vnPayTranId.ToString(),
                VnpayToken = vnpSecureHash,
                VnpayResponseCode = vnpResponseCode,
            };
        }

        public string GetIpAddress(HttpContext context)
        {
            try
            {
                var remoteIpAddress = context.Connection.RemoteIpAddress;
                if (remoteIpAddress != null)
                {
                    if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                    {
                        remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                            .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                    }
                    return remoteIpAddress?.ToString() ?? "127.0.0.1";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            return "127.0.0.1";
        }

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var retValue) ? retValue : string.Empty;
        }

        public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
        {
            var data = new StringBuilder();
            foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }

            var querystring = data.ToString().TrimEnd('&');
            var vnpSecureHash = HmacSha512(vnpHashSecret, querystring);
            return baseUrl + "?" + querystring + "&vnp_SecureHash=" + vnpSecureHash;
        }

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            var rspRaw = GetResponseData();
            var myChecksum = HmacSha512(secretKey, rspRaw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string HmacSha512(string key, string inputData)
        {
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
            return string.Concat(hmac.ComputeHash(Encoding.UTF8.GetBytes(inputData)).Select(b => b.ToString("x2")));
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();
            _responseData.Remove("vnp_SecureHashType");
            _responseData.Remove("vnp_SecureHash");
            foreach (var (key, value) in _responseData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }
            return data.ToString().TrimEnd('&');
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }


}
