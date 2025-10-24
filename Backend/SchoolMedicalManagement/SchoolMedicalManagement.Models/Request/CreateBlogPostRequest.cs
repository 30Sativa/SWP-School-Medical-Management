using System;

namespace SchoolMedicalManagement.Models.Request
{
    public class CreateBlogPostRequest
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public Guid? AuthorId { get; set; }
        public DateOnly? PostedDate { get; set; }
        public bool? IsActive { get; set; }
    }
} 