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

        public AuthService(UserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }


        // First login change password
        public async Task<BaseResponse> ChangePasswordAfterFirstLogin(int id, Models.Request.ChangePasswordUser userChangePasswordRequest)
        {
            var user = await _userRepository.GetUserById(id);
            if (user == null || user.IsFirstLogin == false)
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Change password fail",
                    Data = null
                };

            user.Password = HashPassword.HashPasswordd(userChangePasswordRequest.NewPassword);
            user.IsFirstLogin = false;

            await _userRepository.UpdateAsync(user);

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Password changed successfully.",
                Data = new Models.Response.ChangePasswordUser
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    RoleName = user.Role.RoleName,
                    Email = user.Email,
                    Phone = user.Phone,
                    IsFirstLogin = user.IsFirstLogin.GetValueOrDefault() // GetValueOrDefault() sẽ trả về false nếu user.IsFirstLogin == null
                }
            };
        }


        //Login
        public async Task<BaseResponse> Login(LoginUserRequest loginRequest)
        {
            var user = await _userRepository.GetLogin(loginRequest);

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
                Data = new LoginUserRespsonse
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Role = new Role()
                    {
                        RoleId = user.Role.RoleId,
                        RoleName = user.Role.RoleName
                    },
                    Token = new JwtSecurityTokenHandler().WriteToken(token)
                }
            };
        }
    }
}
