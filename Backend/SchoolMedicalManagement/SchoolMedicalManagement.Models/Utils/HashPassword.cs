﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Models.Utils
{
    public class HashPassword
    {
        public static string HashPasswordd(string rawPassword)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawPassword));
            return Convert.ToBase64String(bytes);
        }
    }
}
