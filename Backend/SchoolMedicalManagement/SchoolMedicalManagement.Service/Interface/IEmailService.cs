using SchoolMedicalManagement.Models.Response;
using System;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IEmailService
    {
    
        //Gửi email thông thường
        Task<BaseResponse> SendEmailAsync(string to, string subject, string body);

        //Gửi otp qua email
        Task SendOtpEmailAsync(string to, string otp);

        // Gửi email bằng userId
        Task<BaseResponse> SendEmailByUserIdAsync(Guid userId, string subject, string body);
    }
}