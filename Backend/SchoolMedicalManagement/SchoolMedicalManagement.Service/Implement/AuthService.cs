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
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Repository.Request;
using SchoolMedicalManagement.Repository.Response;
using SchoolMedicalManagement.Service.Interface;

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

        public async Task<UserLoginResponse> Login(UserLoginRequest loginRequest)
        {
            var user = await _userRepository.Login(loginRequest);

            if (user == null) return null;

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
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new UserLoginResponse
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Role = new Role()
                {
                    RoleId = user.Role.RoleId,
                    RoleName = user.Role.RoleName
                },
                Token = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }
    }
}
