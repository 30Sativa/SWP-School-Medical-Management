using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class OtpService : IOtpService
    {
        private readonly IDistributedCache _cache;
        private readonly IConfiguration _configuration;
        private readonly int _otpExpirationMinutes;

        
        public OtpService(IDistributedCache cache, IConfiguration configuration)
        {
            _cache = cache;
            _configuration = configuration;
            _otpExpirationMinutes = _configuration.GetValue<int>("Redis:OtpExpirationMinutes");
        }

        // Tạo OTP ngẫu nhiên 6 số và lưu vào Redis
        public async Task<string> GenerateOtpAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email cannot be null or empty", nameof(email));

            // Tạo OTP ngẫu nhiên 6 số
            string otp = GenerateRandomOtp();

           // Lưu OTP vào Redis với key là "OTP:{email}"
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_otpExpirationMinutes)
            };

            await _cache.SetStringAsync($"OTP:{email}", otp, options);

            return otp;
        }

        // Xác thực OTP người dùng nhập
        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email cannot be null or empty", nameof(email));

            if (string.IsNullOrEmpty(otp))
                throw new ArgumentException("OTP cannot be null or empty", nameof(otp));

            // Lấy OTP từ Redis
            string storedOtp = await _cache.GetStringAsync($"OTP:{email}");

            // // So sánh OTP
            if (string.IsNullOrEmpty(storedOtp) || storedOtp != otp)
                return false;

            return true;
        }

        // Xóa OTP khỏi Redis sau khi sử dụng
        public async Task InvalidateOtpAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email cannot be null or empty", nameof(email));

            // Remove the OTP from Redis
            await _cache.RemoveAsync($"OTP:{email}");
        }

        private string GenerateRandomOtp()
        {
            // Generate a random 6-digit OTP
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            uint random = BitConverter.ToUInt32(bytes, 0);
            return (random % 1000000).ToString("D6");
        }
    }
}