using System;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IEmailService
    {
        /// <summary>
        /// Sends an email with the specified subject and body to the recipient
        /// </summary>
        /// <param name="to">Recipient email address</param>
        /// <param name="subject">Email subject</param>
        /// <param name="body">Email body (HTML)</param>
        /// <returns>A task representing the asynchronous operation</returns>
        Task SendEmailAsync(string to, string subject, string body);

        /// <summary>
        /// Sends an OTP email to the specified recipient
        /// </summary>
        /// <param name="to">Recipient email address</param>
        /// <param name="otp">The OTP to include in the email</param>
        /// <returns>A task representing the asynchronous operation</returns>
        Task SendOtpEmailAsync(string to, string otp);
    }
}