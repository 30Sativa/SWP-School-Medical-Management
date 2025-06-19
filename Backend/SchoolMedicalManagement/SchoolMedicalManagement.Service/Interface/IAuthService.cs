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
        Task<BaseResponse> Login(LoginUserRequest loginRequest);
        Task<BaseResponse> ChangePasswordAfterFirstLogin(Guid id, ChangePasswordUserRequest request);

        /// <summary>
        /// Initiates the password reset process by generating and sending an OTP to the user's email
        /// </summary>
        /// <param name="request">The forgot password request containing the user's email</param>
        /// <returns>A response indicating success or failure</returns>
        Task<BaseResponse> ForgotPasswordAsync(ForgotPasswordRequest request);

        /// <summary>
        /// Verifies the OTP provided by the user
        /// </summary>
        /// <param name="request">The verify OTP request containing the user's email and OTP</param>
        /// <returns>A response indicating success or failure</returns>
        Task<BaseResponse> VerifyOtpAsync(VerifyOtpRequest request);

        /// <summary>
        /// Resets the user's password after successful OTP verification
        /// </summary>
        /// <param name="request">The reset password request containing the user's email and new password</param>
        /// <returns>A response indicating success or failure</returns>
        Task<BaseResponse> ResetPasswordAsync(ResetPasswordRequest request);
    }
}
