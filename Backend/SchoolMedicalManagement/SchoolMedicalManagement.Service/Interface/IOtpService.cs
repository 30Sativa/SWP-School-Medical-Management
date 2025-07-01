using System;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IOtpService
    {
        /// <summary>
        /// Generates a 6-digit OTP for the specified email and stores it in Redis
        /// </summary>
        /// <param name="email">The email address to generate OTP for</param>
        /// <returns>The generated OTP</returns>
        Task<string> GenerateOtpAsync(string email);

        /// <summary>
        /// Verifies if the provided OTP matches the one stored in Redis for the specified email
        /// </summary>
        /// <param name="email">The email address to verify OTP for</param>
        /// <param name="otp">The OTP to verify</param>
        /// <returns>True if OTP is valid, false otherwise</returns>
        Task<bool> VerifyOtpAsync(string email, string otp);

        /// <summary>
        /// Invalidates the OTP for the specified email
        /// </summary>
        /// <param name="email">The email address to invalidate OTP for</param>
        Task InvalidateOtpAsync(string email);
    }
}