using Microsoft.Extensions.Configuration;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Models.Response;

namespace SchoolMedicalManagement.Service.Implement
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _senderEmail;
        private readonly string _senderName;
        private readonly UserRepository _userRepository;

        public EmailService(IConfiguration configuration, UserRepository userRepository)
        {
            _configuration = configuration;
            _smtpServer = _configuration["EmailSettings:SmtpServer"];
            _smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
            _smtpUsername = _configuration["EmailSettings:SmtpUsername"];
            _smtpPassword = _configuration["EmailSettings:SmtpPassword"];
            _senderEmail = _configuration["EmailSettings:SenderEmail"];
            _senderName = _configuration["EmailSettings:SenderName"];
            _userRepository = userRepository;
        }
        
        // Gửi email thông thường
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            if (string.IsNullOrEmpty(to))
                throw new ArgumentException("Recipient email cannot be null or empty", nameof(to));

            var message = new MailMessage
            {
                From = new MailAddress(_senderEmail, _senderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(new MailAddress(to));
            
            // Cấu hình SMTP và gửi mail
            using var client = new SmtpClient(_smtpServer, _smtpPort)
            {
                Credentials = new NetworkCredential(_smtpUsername, _smtpPassword),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }

        // Gửi email OTP với template đẹp
        public async Task SendOtpEmailAsync(string to, string otp)
        {
            string subject = "Your Password Reset OTP";
            string body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #4CAF50; color: white; padding: 10px; text-align: center; }}
                        .content {{ padding: 20px; }}
                        .otp {{ font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; }}
                        .footer {{ font-size: 12px; text-align: center; margin-top: 20px; color: #777; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Password Reset OTP</h2>
                        </div>
                        <div class='content'>
                            <p>Hello,</p>
                            <p>You have requested to reset your password. Please use the following OTP to complete the process:</p>
                            <div class='otp'>{otp}</div>
                            <p>This OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email.</p>
                            <p>Thank you,<br>School Medical Management Team</p>
                        </div>
                        <div class='footer'>
                            <p>This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>";

            await SendEmailAsync(to, subject, body);
        }

        // Gửi email bằng userId
        public async Task<BaseResponse> SendEmailByUserIdAsync(Guid userId, string subject, string body)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null || string.IsNullOrEmpty(user.Email))
            {
                return new BaseResponse
                {
                    Status = "400",
                    Message = "Không tìm thấy người dùng hoặc email trống.",
                    Data = null
                };
            }
            try
            {
                await SendEmailAsync(user.Email, subject, body);
                return new BaseResponse
                {
                    Status = "200",
                    Message = "Gửi email thành công.",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new BaseResponse
                {
                    Status = "500",
                    Message = $"Gửi email thất bại: {ex.Message}",
                    Data = null
                };
            }
        }
    }
}