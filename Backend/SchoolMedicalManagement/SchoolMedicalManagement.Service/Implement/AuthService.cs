using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Azure.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Utils;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Models.Request;

using SchoolMedicalManagement.Service.Interface;
using SchoolMedicalManagement.Models.Response;
using Microsoft.AspNetCore.Http;

namespace SchoolMedicalManagement.Service.Implement
{
    public class AuthService : IAuthService 
    {
        private readonly UserRepository _userRepository;
        private readonly IConfiguration _config;
        private readonly IOtpService _otpService;
        private readonly IEmailService _emailService;

        public AuthService(
            UserRepository userRepository, 
            IConfiguration config,
            IOtpService otpService,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _config = config;
            _otpService = otpService;
            _emailService = emailService;
        }


        // First login change password
        public async Task<BaseResponse> ChangePasswordAfterFirstLogin(Guid id, ChangePasswordUserRequest Request)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null || user.IsFirstLogin == false)
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Change password fail",
                    Data = null
                };

            user.Password = HashPassword.HashPasswordd(Request.NewPassword);
            user.IsFirstLogin = false;

            await _userRepository.UpdateAsync(user);

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Password changed successfully.",
                Data = new ChangePasswordUserResponse
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    RoleName = user.Role.RoleName,
                    Email = user.Email,
                    Phone = user.Phone,
                    IsFirstLogin = user.IsFirstLogin
                }
            };
        }


        //Login
        public async Task<BaseResponse> Login(LoginUserRequest loginRequest)
        {
            var user = await _userRepository.GetLoginUser(loginRequest);

            if (user == null) {
                return new BaseResponse{
                    Status = StatusCodes.Status401Unauthorized.ToString(),
                    Message = "Invalid username or password.",
                    Data = null
                }
            ;
            }
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Role, user.Role.RoleName)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Login successful.",
                Data = new LoginUserResponse
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    RoleName = user.Role.RoleName,
                    IsFirstLogin = user.IsFirstLogin,
                    Token = new JwtSecurityTokenHandler().WriteToken(token)
                }
            };
        }

        // Gửi OTP quên mật khẩu đến email người dùng
        public async Task<BaseResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            // Kiểm tra email hợp lệ và check ng dùng còn active ko?
            var user = await _userRepository.GetUserByEmail(request.Email);
            if (user == null || user.IsActive == false)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Email không tồn tại hoặc tài khoản không hoạt động.",
                    Data = null
                };
            }

            // Sinh OTP và lưu vào Redis
            var otp = await _otpService.GenerateOtpAsync(request.Email);

            // Gửi email OTP
            await _emailService.SendOtpEmailAsync(request.Email, otp);

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "OTP đã được gửi đến email của bạn.",
                Data = null
            };
        }

        // Gộp xác thực OTP và đặt lại mật khẩu
        public async Task<BaseResponse> VerifyOtpAndResetPasswordAsync(VerifyOtpAndResetPasswordRequest request)
        {
            // Kiểm tra email hợp lệ
            var user = await _userRepository.GetUserByEmail(request.Email);
            if (user == null || user.IsActive == false)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Email không tồn tại hoặc tài khoản không hoạt động.",
                    Data = null
                };
            }

            // Kiểm tra OTP với Redis
            var isValid = await _otpService.VerifyOtpAsync(request.Email, request.Otp);
            if (!isValid)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "OTP không hợp lệ hoặc đã hết hạn.",
                    Data = null
                };
            }

            // Đặt lại mật khẩu mới
            user.Password = HashPassword.HashPasswordd(request.NewPassword);
            await _userRepository.UpdateUser(user);

            // Hủy OTP sau khi đổi mật khẩu thành công
            await _otpService.InvalidateOtpAsync(request.Email);

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Đặt lại mật khẩu thành công.",
                Data = null
            };
        }
    }
}
