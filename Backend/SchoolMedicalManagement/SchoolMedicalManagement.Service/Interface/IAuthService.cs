using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IAuthService
    {
        // Đăng nhập hệ thống
        Task<BaseResponse> Login(LoginUserRequest loginRequest);
        // Đổi mật khẩu sau lần đăng nhập đầu tiên
        Task<BaseResponse> ChangePasswordAfterFirstLogin(Guid id, ChangePasswordUserRequest request);
        // Gửi OTP quên mật khẩu đến email
        Task<BaseResponse> ForgotPasswordAsync(ForgotPasswordRequest request);
        // Gộp xác thực OTP và đặt lại mật khẩu thành một API duy nhất
        Task<BaseResponse> VerifyOtpAndResetPasswordAsync(VerifyOtpAndResetPasswordRequest request);
    }
}
