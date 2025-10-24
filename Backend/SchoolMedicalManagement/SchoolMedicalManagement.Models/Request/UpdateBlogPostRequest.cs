using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class UpdateBlogPostRequest
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public bool? IsActive { get; set; }
    }
} 